import {
  DEFAULT_BENCHMARK,
  SECTOR_BENCHMARKS,
  type SectorBenchmark
} from '@/shared/constants/benchmarks';
import type {
  AssetMetrics,
  AssetProfile,
  AssetScores,
  ScoreComponent,
  ScoreItemDetail
} from '@/shared/types/domain';
import { formatPercent } from '@/shared/utils/formatPercent';

const formatRatio = (value: number | null) => (value !== null ? value.toFixed(2) : '—');

/**
 * Absolute, sector-independent quality hurdles. Each metric's displayed
 * `benchmark` label is derived from the same constant used in its scoring rule,
 * so the reference shown to the user always matches the threshold that produced
 * the score (auditability). Sector-relative metrics (ROE, operating margin, P/E,
 * revenue growth, D/E) instead compare against `SECTOR_BENCHMARKS`.
 */
const EXCELLENT_ROE = 0.2;
const STRONG_ROA = 0.08;
const HIGH_GROSS_MARGIN = 0.5;
const WEAK_GROSS_MARGIN = 0.2;
const HEALTHY_NET_MARGIN = 0.15;
const THIN_NET_MARGIN = 0.05;
const THIN_OPERATING_MARGIN = 0.05;
const STRONG_EARNINGS_GROWTH = 0.15;
const MODERATE_EARNINGS_GROWTH = 0.05;
const SEVERE_EARNINGS_DECLINE = -0.1;
const REVENUE_CONTRACTION = -0.05;
const ATTRACTIVE_PEG = 1.2;
const EXPENSIVE_PEG = 2.5;
const LOW_PRICE_TO_BOOK = 2.0;
const HIGH_PRICE_TO_BOOK = 7.0;
const HEALTHY_CURRENT_RATIO = 1.5;
const MINIMUM_CURRENT_RATIO = 1.0;
const SOLID_QUICK_RATIO = 1.0;
const STRONG_GROSS_TO_OPERATING = 0.5;
const WEAK_GROSS_TO_OPERATING = 0.2;
const STRONG_CASH_CONVERSION = 0.8;
const WEAK_CASH_CONVERSION = 0.4;

/** How far a sector-relative metric must clear its benchmark to rate as "outperforming". */
const OPERATING_MARGIN_OUTPERFORMANCE = 0.05;
const REVENUE_GROWTH_OUTPERFORMANCE = 0.05;

/** Multipliers applied to the sector Debt/Equity benchmark to bound "low" and "elevated" leverage. */
const LOW_LEVERAGE_FACTOR = 0.75;
const HIGH_LEVERAGE_FACTOR = 1.5;

/** Multipliers applied to the sector P/E benchmark to bound "deep discount" and "heavy premium". */
const PE_DEEP_DISCOUNT_FACTOR = 0.7;
const PE_HEAVY_PREMIUM_FACTOR = 1.4;

/** Score fraction (0..1) assigned when a metric sits exactly at the neutral midpoint. */
const NEUTRAL_FRACTION = 0.5;
/** Headline score (0..100) used when no dimension carries any evaluable metric. */
const NEUTRAL_SCORE = 50;

/** Weights of each factor in the consolidated 0-100 fundamental score. */
export const CONSOLIDATED_WEIGHTS = {
  businessQuality: 0.25,
  growth: 0.2,
  financialHealth: 0.25,
  valuation: 0.2,
  efficiency: 0.1
} as const;

/** Subset used for the "Fundamental Health Index" (excludes valuation pricing). */
export const FUNDAMENTAL_HEALTH_WEIGHTS = {
  businessQuality: 0.25,
  growth: 0.2,
  financialHealth: 0.25,
  efficiency: 0.1
} as const;

const BUSINESS_QUALITY_METHODOLOGY =
  'Evaluates profitability ratios (ROE, ROA, and Margins) relative to sector specific benchmarks and absolute hurdles.';
const GROWTH_METHODOLOGY =
  'Evaluates year-over-year top-line and bottom-line expansion rates against sector benchmarks.';
const FINANCIAL_HEALTH_METHODOLOGY =
  'Evaluates structural capital leverage and liquidity buffers to measure overall insolvency/liquidity risk.';
const VALUATION_METHODOLOGY =
  'Compares valuation multiples against historical industry benchmarks to assess the available margin of safety.';
const EFFICIENCY_METHODOLOGY =
  'Analyzes overhead conversion, operating leverage efficiency, and FCF generation capability.';

interface MetricEval {
  name: string;
  value: string;
  weight: number;
  fraction: number;
  benchmark: string;
  explanation: string;
}

type ScoreTier = readonly [condition: boolean, fraction: number, explanation: string];

/**
 * Returns the score fraction and explanation of the first satisfied tier, falling
 * back to a default when none match. Tiers are ordered most-favourable first; the
 * predicates and explanations are evaluated eagerly (cheap, side-effect free).
 */
function classify(
  tiers: readonly ScoreTier[],
  fallback: readonly [fraction: number, explanation: string]
): { fraction: number; explanation: string } {
  for (const [condition, fraction, explanation] of tiers) {
    if (condition) {
      return { fraction, explanation };
    }
  }
  return { fraction: fallback[0], explanation: fallback[1] };
}

/**
 * Builds a scored dimension from its evaluated metrics. The dimension score is the
 * weight-normalised average of the metric fractions, so absent metrics simply drop
 * out without biasing the result. Per-metric `points` are signed around the neutral
 * midpoint (fraction 0.5 → 0, 1 → +weight, 0 → −weight) to read as gains/penalties.
 */
function buildDimension(
  metrics: MetricEval[],
  methodology: string,
  details: string[]
): ScoreComponent {
  const totalWeight = metrics.reduce((sum, metric) => sum + metric.weight, 0);
  const rawScore =
    totalWeight > 0
      ? metrics.reduce((sum, metric) => sum + metric.fraction * metric.weight, 0) / totalWeight
      : NEUTRAL_FRACTION;

  const breakdown: ScoreItemDetail[] = metrics.map((metric) => {
    const normalizedWeight = totalWeight > 0 ? Math.round((metric.weight / totalWeight) * 100) : 0;
    return {
      name: metric.name,
      value: metric.value,
      weight: normalizedWeight,
      points: Math.round((metric.fraction - NEUTRAL_FRACTION) * 2 * normalizedWeight),
      maxPoints: normalizedWeight,
      benchmark: metric.benchmark,
      explanation: metric.explanation
    };
  });

  return { score: Math.round(rawScore * 100), methodology, breakdown, details };
}

/**
 * Assembles a dimension from ordered entries: a `MetricEval` contributes to both the
 * score and the audit trail, a bare string is an "unavailable" note for the audit
 * trail only, and `null` is skipped. Entry order is preserved in `details`.
 */
function buildDimensionFrom(
  methodology: string,
  entries: ReadonlyArray<MetricEval | string | null>
): ScoreComponent {
  const present = entries.filter((entry): entry is MetricEval | string => entry !== null);
  const metrics = present.filter((entry): entry is MetricEval => typeof entry !== 'string');
  const details = present.map((entry) => (typeof entry === 'string' ? entry : entry.explanation));
  return buildDimension(metrics, methodology, details);
}

function scoreReturnOnEquity(roe: number, benchmark: SectorBenchmark): MetricEval {
  const { fraction, explanation } = classify(
    [
      [
        roe >= EXCELLENT_ROE,
        1.0,
        `Excellent Return on Equity (ROE: ${formatPercent(roe)}) exceeds high hurdle of ${formatPercent(EXCELLENT_ROE)}.`
      ],
      [
        roe > benchmark.roe,
        0.8,
        `Superior ROE (${formatPercent(roe)}) is above sector benchmark of ${formatPercent(benchmark.roe)}.`
      ],
      [roe < 0, 0.0, `Negative ROE (${formatPercent(roe)}) indicates capital destruction.`]
    ],
    [
      0.3,
      `Sub-par ROE (${formatPercent(roe)}) lags sector average of ${formatPercent(benchmark.roe)}.`
    ]
  );
  return {
    name: 'Return on Equity (ROE)',
    value: formatPercent(roe),
    weight: 25,
    fraction,
    benchmark: formatPercent(benchmark.roe),
    explanation
  };
}

function scoreReturnOnAssets(roa: number): MetricEval {
  const { fraction, explanation } = classify(
    [
      [
        roa >= STRONG_ROA,
        1.0,
        `Strong ROA (${formatPercent(roa)}) indicates highly efficient asset utilization.`
      ],
      [roa < 0, 0.0, `Negative ROA (${formatPercent(roa)}) indicates losses relative to assets.`]
    ],
    [0.5, `Standard ROA (${formatPercent(roa)}) inline with sector expectations.`]
  );
  return {
    name: 'Return on Assets (ROA)',
    value: formatPercent(roa),
    weight: 15,
    fraction,
    benchmark: formatPercent(STRONG_ROA),
    explanation
  };
}

function scoreGrossMargin(grossMargin: number): MetricEval {
  const { fraction, explanation } = classify(
    [
      [
        grossMargin >= HIGH_GROSS_MARGIN,
        1.0,
        `High pricing power shown by Gross Margin of ${formatPercent(grossMargin)}.`
      ],
      [
        grossMargin < WEAK_GROSS_MARGIN,
        0.0,
        `Low Gross Margin (${formatPercent(grossMargin)}) suggests intense competition or high input costs.`
      ]
    ],
    [0.75, `Moderate Gross Margin (${formatPercent(grossMargin)}) within normal range.`]
  );
  return {
    name: 'Gross Margin',
    value: formatPercent(grossMargin),
    weight: 20,
    fraction,
    benchmark: formatPercent(HIGH_GROSS_MARGIN),
    explanation
  };
}

function scoreOperatingMargin(operatingMargin: number, benchmark: SectorBenchmark): MetricEval {
  const { fraction, explanation } = classify(
    [
      [
        operatingMargin - benchmark.operatingMargin > OPERATING_MARGIN_OUTPERFORMANCE,
        1.0,
        `Operating Margin of ${formatPercent(operatingMargin)} is significantly above sector average.`
      ],
      [
        operatingMargin < THIN_OPERATING_MARGIN,
        0.0,
        `Extremely thin Operating Margin of ${formatPercent(operatingMargin)}.`
      ],
      [
        operatingMargin < benchmark.operatingMargin,
        0.4,
        `Operating Margin (${formatPercent(operatingMargin)}) trails sector average of ${formatPercent(benchmark.operatingMargin)}.`
      ]
    ],
    [0.75, `Healthy Operating Margin (${formatPercent(operatingMargin)}) inline with sector.`]
  );
  return {
    name: 'Operating Margin',
    value: formatPercent(operatingMargin),
    weight: 20,
    fraction,
    benchmark: formatPercent(benchmark.operatingMargin),
    explanation
  };
}

function scoreNetMargin(netMargin: number): MetricEval {
  const { fraction, explanation } = classify(
    [
      [
        netMargin >= HEALTHY_NET_MARGIN,
        1.0,
        `Healthy Net Profit Margin of ${formatPercent(netMargin)}.`
      ],
      [
        netMargin < THIN_NET_MARGIN,
        0.15,
        `Thin net earnings capacity: Profit Margin of ${formatPercent(netMargin)}.`
      ]
    ],
    [0.75, `Standard Net Profit Margin of ${formatPercent(netMargin)}.`]
  );
  return {
    name: 'Net Profit Margin',
    value: formatPercent(netMargin),
    weight: 20,
    fraction,
    benchmark: formatPercent(HEALTHY_NET_MARGIN),
    explanation
  };
}

function scoreBusinessQuality(metrics: AssetMetrics, benchmark: SectorBenchmark): ScoreComponent {
  const { roe, roa, grossMargin, operatingMargin, netMargin } = metrics.profitability;
  return buildDimensionFrom(BUSINESS_QUALITY_METHODOLOGY, [
    roe !== null ? scoreReturnOnEquity(roe, benchmark) : 'ROE metric is unavailable.',
    roa !== null ? scoreReturnOnAssets(roa) : null,
    grossMargin !== null ? scoreGrossMargin(grossMargin) : null,
    operatingMargin !== null ? scoreOperatingMargin(operatingMargin, benchmark) : null,
    netMargin !== null ? scoreNetMargin(netMargin) : null
  ]);
}

function scoreRevenueGrowth(revenueGrowth: number, benchmark: SectorBenchmark): MetricEval {
  const { fraction, explanation } = classify(
    [
      [
        revenueGrowth >= benchmark.revenueGrowth + REVENUE_GROWTH_OUTPERFORMANCE,
        1.0,
        `Outstanding Revenue Growth (${formatPercent(revenueGrowth)} YoY) outperforming sector benchmark of ${formatPercent(benchmark.revenueGrowth)}.`
      ],
      [
        revenueGrowth >= benchmark.revenueGrowth,
        0.85,
        `Solid Revenue Growth (${formatPercent(revenueGrowth)} YoY) matches or exceeds sector benchmark.`
      ],
      [
        revenueGrowth <= REVENUE_CONTRACTION,
        0.0,
        `Revenue contraction detected (${formatPercent(revenueGrowth)} YoY), indicating declining demand.`
      ]
    ],
    [
      0.35,
      `Revenue Growth (${formatPercent(revenueGrowth)}) lags sector benchmark of ${formatPercent(benchmark.revenueGrowth)}.`
    ]
  );
  return {
    name: 'YoY Revenue Growth',
    value: formatPercent(revenueGrowth),
    weight: 50,
    fraction,
    benchmark: formatPercent(benchmark.revenueGrowth),
    explanation
  };
}

function scoreEarningsGrowth(earningsGrowth: number): MetricEval {
  const { fraction, explanation } = classify(
    [
      [
        earningsGrowth >= STRONG_EARNINGS_GROWTH,
        1.0,
        `High-velocity Earnings Growth (${formatPercent(earningsGrowth)} YoY).`
      ],
      [
        earningsGrowth >= MODERATE_EARNINGS_GROWTH,
        0.8,
        `Moderate Earnings Growth (${formatPercent(earningsGrowth)} YoY).`
      ],
      [
        earningsGrowth <= SEVERE_EARNINGS_DECLINE,
        0.0,
        `Severe earnings deterioration (${formatPercent(earningsGrowth)} YoY).`
      ]
    ],
    [0.6, `Flat or low Earnings Growth (${formatPercent(earningsGrowth)} YoY).`]
  );
  return {
    name: 'YoY Earnings Growth',
    value: formatPercent(earningsGrowth),
    weight: 50,
    fraction,
    benchmark: formatPercent(STRONG_EARNINGS_GROWTH),
    explanation
  };
}

function scoreGrowth(metrics: AssetMetrics, benchmark: SectorBenchmark): ScoreComponent {
  const { quarterlyRevenueGrowth, quarterlyEarningsGrowth } = metrics.growth;
  return buildDimensionFrom(GROWTH_METHODOLOGY, [
    quarterlyRevenueGrowth !== null
      ? scoreRevenueGrowth(quarterlyRevenueGrowth, benchmark)
      : 'Revenue growth data unavailable.',
    quarterlyEarningsGrowth !== null
      ? scoreEarningsGrowth(quarterlyEarningsGrowth)
      : 'Earnings growth data unavailable.'
  ]);
}

function scoreDebtToEquity(debtToEquity: number, benchmark: SectorBenchmark): MetricEval {
  const sectorStandard = benchmark.debtToEquity.toFixed(1);
  const { fraction, explanation } = classify(
    [
      [
        debtToEquity < 0,
        0.0,
        `Negative Debt/Equity (${debtToEquity.toFixed(1)}%) indicates negative shareholder equity, a balance-sheet distress signal.`
      ],
      [
        debtToEquity <= benchmark.debtToEquity * LOW_LEVERAGE_FACTOR,
        1.0,
        `Low leverage: Debt/Equity ratio (${debtToEquity.toFixed(1)}%) is well below industry standard of ${sectorStandard}%.`
      ],
      [
        debtToEquity > benchmark.debtToEquity * HIGH_LEVERAGE_FACTOR,
        0.0,
        `Elevated debt level: Debt/Equity ratio (${debtToEquity.toFixed(1)}%) significantly exceeds sector standard of ${sectorStandard}%.`
      ]
    ],
    [
      0.75,
      `Standard leverage: Debt/Equity ratio (${debtToEquity.toFixed(1)}%) is inline with industry.`
    ]
  );
  return {
    name: 'Debt to Equity Ratio',
    value: `${debtToEquity.toFixed(1)}%`,
    weight: 30,
    fraction,
    benchmark: `${sectorStandard}%`,
    explanation
  };
}

function scoreCurrentRatio(currentRatio: number): MetricEval {
  const { fraction, explanation } = classify(
    [
      [
        currentRatio >= HEALTHY_CURRENT_RATIO,
        1.0,
        `Excellent short-term liquidity: Current Ratio is at ${formatRatio(currentRatio)} (recommended >= ${formatRatio(HEALTHY_CURRENT_RATIO)}).`
      ],
      [
        currentRatio < MINIMUM_CURRENT_RATIO,
        0.0,
        `Liquidity risk: Current Ratio of ${formatRatio(currentRatio)} indicates liabilities exceed current assets.`
      ]
    ],
    [0.75, `Acceptable short-term liquidity: Current Ratio is ${formatRatio(currentRatio)}.`]
  );
  return {
    name: 'Current Ratio',
    value: formatRatio(currentRatio),
    weight: 30,
    fraction,
    benchmark: formatRatio(HEALTHY_CURRENT_RATIO),
    explanation
  };
}

function scoreQuickRatio(quickRatio: number): MetricEval {
  const { fraction, explanation } = classify(
    [
      [
        quickRatio >= SOLID_QUICK_RATIO,
        1.0,
        `Solid quick ratio of ${formatRatio(quickRatio)} (cash & receivables cover immediate liabilities).`
      ]
    ],
    [
      0.25,
      `Sub-optimal Quick Ratio of ${formatRatio(quickRatio)} indicates inventory dependencies for solvency.`
    ]
  );
  return {
    name: 'Quick Ratio',
    value: formatRatio(quickRatio),
    weight: 20,
    fraction,
    benchmark: formatRatio(SOLID_QUICK_RATIO),
    explanation
  };
}

function scoreFreeCashFlowCushion(freeCashFlow: number): MetricEval {
  const isPositive = freeCashFlow > 0;
  return {
    name: 'Free Cash Flow Cushion',
    value: isPositive ? 'Positive' : 'Negative',
    weight: 20,
    fraction: isPositive ? 1.0 : 0.0,
    benchmark: '> 0',
    explanation: isPositive
      ? 'Free Cash Flow is positive, providing a protective buffer for debt obligations.'
      : 'Free Cash Flow is negative, indicating cash burn which increases solvency risks.'
  };
}

function scoreFinancialHealth(metrics: AssetMetrics, benchmark: SectorBenchmark): ScoreComponent {
  const { debtToEquity, currentRatio, quickRatio } = metrics.leverage;
  const { freeCashFlow } = metrics.cashFlow;
  return buildDimensionFrom(FINANCIAL_HEALTH_METHODOLOGY, [
    debtToEquity !== null ? scoreDebtToEquity(debtToEquity, benchmark) : null,
    currentRatio !== null ? scoreCurrentRatio(currentRatio) : null,
    quickRatio !== null ? scoreQuickRatio(quickRatio) : null,
    freeCashFlow !== null ? scoreFreeCashFlowCushion(freeCashFlow) : null
  ]);
}

// ---------------------------------------------------------------------------
// Valuation metrics
// ---------------------------------------------------------------------------

function scorePriceEarnings(
  peRatio: number | null,
  forwardPe: number | null,
  benchmark: SectorBenchmark
): MetricEval {
  const effectivePe = forwardPe !== null && forwardPe > 0 ? forwardPe : peRatio;

  if (effectivePe === null || effectivePe <= 0) {
    return {
      name: 'P/E Ratio (Trailing/Forward)',
      value: '—',
      weight: 40,
      fraction: 0.35,
      benchmark: formatRatio(benchmark.forwardPE),
      explanation:
        'PE ratio is negative or unavailable, indicating loss-making operations or lack of details.'
    };
  }

  const { fraction, explanation } = classify(
    [
      [
        effectivePe <= benchmark.forwardPE * PE_DEEP_DISCOUNT_FACTOR,
        1.0,
        `Significant discount: PE ratio (${formatRatio(effectivePe)}) is at a >30% discount vs sector benchmark of ${benchmark.forwardPE}.`
      ],
      [
        effectivePe <= benchmark.forwardPE,
        0.8,
        `Fair value: PE ratio (${formatRatio(effectivePe)}) is inline with or below sector benchmark.`
      ],
      [
        effectivePe >= benchmark.forwardPE * PE_HEAVY_PREMIUM_FACTOR,
        0.0,
        `Premium pricing: PE ratio (${formatRatio(effectivePe)}) stands at a heavy premium vs sector benchmark of ${benchmark.forwardPE}.`
      ]
    ],
    [
      0.35,
      `Slight premium: PE ratio (${formatRatio(effectivePe)}) is slightly above sector average.`
    ]
  );
  return {
    name: 'P/E Ratio (Trailing/Forward)',
    value: formatRatio(effectivePe),
    weight: 40,
    fraction,
    benchmark: formatRatio(benchmark.forwardPE),
    explanation
  };
}

function scorePegRatio(pegRatio: number): MetricEval {
  const { fraction, explanation } = classify(
    [
      [
        pegRatio > 0 && pegRatio <= ATTRACTIVE_PEG,
        1.0,
        `Highly attractive growth pricing: PEG ratio of ${formatRatio(pegRatio)} suggests undervaluation relative to growth rate.`
      ],
      [
        pegRatio >= EXPENSIVE_PEG,
        0.0,
        `Expensive growth pricing: PEG ratio is elevated at ${formatRatio(pegRatio)}, signaling overvalued growth expectation.`
      ],
      [
        pegRatio <= 0,
        0.35,
        `PEG ratio of ${formatRatio(pegRatio)} is not meaningful (non-positive earnings growth).`
      ]
    ],
    [
      0.625,
      `Normal PEG ratio of ${formatRatio(pegRatio)} indicates pricing is proportional to growth.`
    ]
  );
  return {
    name: 'PEG Ratio',
    value: formatRatio(pegRatio),
    weight: 40,
    fraction,
    benchmark: formatRatio(ATTRACTIVE_PEG),
    explanation
  };
}

function scorePriceToBook(priceToBook: number): MetricEval {
  const { fraction, explanation } = classify(
    [
      [
        priceToBook <= LOW_PRICE_TO_BOOK,
        1.0,
        `Low price-to-book multiple of ${formatRatio(priceToBook)}.`
      ],
      [
        priceToBook >= HIGH_PRICE_TO_BOOK,
        0.0,
        `Premium book value pricing: Price-to-Book is high at ${formatRatio(priceToBook)}.`
      ]
    ],
    [0.75, `Standard Price-to-Book ratio of ${formatRatio(priceToBook)}.`]
  );
  return {
    name: 'Price to Book (P/B) Ratio',
    value: formatRatio(priceToBook),
    weight: 20,
    fraction,
    benchmark: formatRatio(LOW_PRICE_TO_BOOK),
    explanation
  };
}

function scoreValuation(metrics: AssetMetrics, benchmark: SectorBenchmark): ScoreComponent {
  const { pe, forwardPe, pegRatio, priceToBook } = metrics.valuation;
  return buildDimensionFrom(VALUATION_METHODOLOGY, [
    scorePriceEarnings(pe, forwardPe, benchmark),
    pegRatio !== null ? scorePegRatio(pegRatio) : null,
    priceToBook !== null ? scorePriceToBook(priceToBook) : null
  ]);
}

// ---------------------------------------------------------------------------
// Efficiency metrics
// ---------------------------------------------------------------------------

function scoreGrossToOperatingConversion(grossMargin: number, operatingMargin: number): MetricEval {
  const conversion = operatingMargin / grossMargin;
  const { fraction, explanation } = classify(
    [
      [
        conversion >= STRONG_GROSS_TO_OPERATING,
        1.0,
        `Excellent overhead management: Retains ${formatPercent(conversion)} of gross profits as operating profits.`
      ],
      [
        conversion < WEAK_GROSS_TO_OPERATING,
        0.0,
        `High SG&A overheads: Only ${formatPercent(conversion)} of gross profits translates into operating income.`
      ]
    ],
    [
      0.75,
      `Standard overhead management: Retains ${formatPercent(conversion)} of gross profits as operating profits.`
    ]
  );
  return {
    name: 'Gross-to-Operating Profit Conversion',
    value: formatPercent(conversion),
    weight: 50,
    fraction,
    benchmark: formatPercent(STRONG_GROSS_TO_OPERATING),
    explanation
  };
}

function scoreCashConversion(cashConversion: number): MetricEval {
  const { fraction, explanation } = classify(
    [
      [
        cashConversion >= STRONG_CASH_CONVERSION,
        1.0,
        `Excellent cash conversion: Free Cash Flow / Operating Cash Flow is at ${formatPercent(cashConversion)}.`
      ],
      [
        cashConversion < WEAK_CASH_CONVERSION,
        0.0,
        `Poor FCF conversion: Only ${formatPercent(cashConversion)} of operating cash is converted into FCF.`
      ]
    ],
    [0.75, `Standard FCF conversion of ${formatPercent(cashConversion)}.`]
  );
  return {
    name: 'Free Cash Flow Conversion Ratio',
    value: formatPercent(cashConversion),
    weight: 20,
    fraction,
    benchmark: formatPercent(STRONG_CASH_CONVERSION),
    explanation
  };
}

function scoreEfficiency(metrics: AssetMetrics): ScoreComponent {
  const { grossMargin, operatingMargin } = metrics.profitability;
  const { cashConversionRatio } = metrics.cashFlow;
  const hasConversionInputs = grossMargin !== null && operatingMargin !== null && grossMargin !== 0;
  return buildDimensionFrom(EFFICIENCY_METHODOLOGY, [
    hasConversionInputs ? scoreGrossToOperatingConversion(grossMargin, operatingMargin) : null,
    cashConversionRatio !== null ? scoreCashConversion(cashConversionRatio) : null
  ]);
}

// ---------------------------------------------------------------------------
// Consolidation
// ---------------------------------------------------------------------------

/**
 * Dimensions with no evaluable metric carry a neutral placeholder score; including
 * them would bias the composite. Renormalise over the dimensions that actually have
 * data so missing inputs neither help nor hurt the headline.
 */
function consolidate(
  components: Record<keyof typeof CONSOLIDATED_WEIGHTS, ScoreComponent>
): number {
  let weightedSum = 0;
  let activeWeight = 0;
  for (const key of Object.keys(CONSOLIDATED_WEIGHTS) as (keyof typeof CONSOLIDATED_WEIGHTS)[]) {
    const component = components[key];
    if (component.breakdown && component.breakdown.length > 0) {
      weightedSum += component.score * CONSOLIDATED_WEIGHTS[key];
      activeWeight += CONSOLIDATED_WEIGHTS[key];
    }
  }
  return activeWeight > 0 ? Math.round(weightedSum / activeWeight) : NEUTRAL_SCORE;
}

export function computeQuantitativeScores(
  metrics: AssetMetrics,
  profile: AssetProfile
): AssetScores {
  const benchmark = SECTOR_BENCHMARKS[profile.sector] || DEFAULT_BENCHMARK;

  const businessQuality = scoreBusinessQuality(metrics, benchmark);
  const growth = scoreGrowth(metrics, benchmark);
  const financialHealth = scoreFinancialHealth(metrics, benchmark);
  const valuation = scoreValuation(metrics, benchmark);
  const efficiency = scoreEfficiency(metrics);

  const consolidated = consolidate({
    businessQuality,
    growth,
    financialHealth,
    valuation,
    efficiency
  });

  return { businessQuality, growth, financialHealth, valuation, efficiency, consolidated };
}

/**
 * Fundamental Health Index: composite of the quality factors that describe the
 * business itself, deliberately excluding valuation (price level). Shares the
 * declared weights so the dashboard cannot drift from the scoring engine.
 */
export function computeFundamentalHealthIndex(scores: AssetScores): number {
  const weights = FUNDAMENTAL_HEALTH_WEIGHTS;
  const totalWeight =
    weights.businessQuality + weights.growth + weights.financialHealth + weights.efficiency;
  const weightedSum =
    scores.businessQuality.score * weights.businessQuality +
    scores.growth.score * weights.growth +
    scores.financialHealth.score * weights.financialHealth +
    scores.efficiency.score * weights.efficiency;
  return Math.round(weightedSum / totalWeight);
}
