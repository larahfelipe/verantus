/**
 * Real-data derivation layer.
 *
 * Every value here is computed from genuine upstream inputs (Yahoo statement
 * modules + live metrics) — no per-symbol hardcoding. When an input is missing
 * we return null/empty so the UI can render "—" instead of inventing a value.
 *
 * The file is organised in four sections:
 *   1. Model parameters     — every numeric assumption, named and documented.
 *   2. Statement assembly    — building the multi-year statement history.
 *   3. Quantitative models   — evolution stats, DCF and reverse DCF.
 *   4. Qualitative synthesis — moat, capital allocation, risk, thesis, research.
 */

import type {
  AssetMetrics,
  AssetProfile,
  CapitalAllocationAnalysis,
  CompanyResearch,
  FinancialStatementYearly,
  FinancialsMetricsEvolution,
  InvestmentThesis,
  MoatAnalysis,
  RiskAnalysis,
  ValuationFramework
} from '@/shared/types/domain';

import { getRaw, safeDiv } from './yahooParse';

type StatementRow = Record<string, unknown>;

// ---------------------------------------------------------------------------
// 1. Model parameters
// ---------------------------------------------------------------------------

/**
 * Effective tax rate applied to EBIT when a filing lacks the detail to derive
 * the real rate. Assumes a US-style ~21% corporate rate; for other
 * jurisdictions (e.g. BRL filings) this can understate taxes and slightly
 * overstate ROIC. The per-year rate from the filing is always preferred.
 */
const DEFAULT_EFFECTIVE_TAX_RATE = 0.21;
/** Upper bound on a derived tax rate, guarding against distorted single years. */
const MAX_DERIVED_TAX_RATE = 0.6;

/** Discounted cash-flow projection horizon, in years. */
const PROJECTION_YEARS = 10;
/** Perpetual growth rate for the Gordon terminal value. */
const TERMINAL_GROWTH_RATE = 0.025;

/** CAPM base discount rate = riskFree + beta * equityPremium. */
const RISK_FREE_RATE = 0.04;
const EQUITY_RISK_PREMIUM = 0.05;
/** Beta assumed when the data source does not expose one. */
const DEFAULT_BETA = 1;
/** Growth estimate assumed when no real growth signal is available. */
const FALLBACK_GROWTH_RATE = 0.04;

/** Bounds keep unreliable estimates inside a defensible range (fractions). */
const BASE_GROWTH_BOUNDS = { min: -0.05, max: 0.25 };
const SCENARIO_GROWTH_BOUNDS = { min: -0.05, max: 0.3 };
const BASE_DISCOUNT_RATE_BOUNDS = { min: 0.06, max: 0.16 };
const SCENARIO_DISCOUNT_RATE_BOUNDS = { min: 0.05, max: 0.2 };
/** Spread (discount − terminal growth) used as the inverse of the exit multiple. */
const TERMINAL_SPREAD_BOUNDS = { min: 0.02, max: 0.18 };

/** Per-scenario deltas applied to the base growth and discount rates. */
const DCF_SCENARIOS = {
  bear: { name: 'Bear Scenario', growthDelta: -0.03, discountDelta: 0.02 },
  base: { name: 'Base Scenario', growthDelta: 0, discountDelta: 0 },
  bull: { name: 'Bull Scenario', growthDelta: 0.03, discountDelta: -0.01 }
} as const;

/** Reverse DCF solves, by bisection, for the growth that justifies the price. */
const REVERSE_DCF_ITERATIONS = 60;
const IMPLIED_GROWTH_BOUNDS = { min: -0.1, max: 0.4 };

/** Revenue/margin trend dead-band: change within ± this counts as "stable". */
const REVENUE_TREND_BAND = 0.02;
const MARGIN_TREND_BAND = 0.01;

/** Moat classification thresholds (fractions). */
const STRONG_ROIC = 0.15;
const HIGH_GROSS_MARGIN = 0.5;
const MODERATE_GROSS_MARGIN = 0.35;
const EXCELLENT_ROE = 0.2;
const SOLID_ROE = 0.15;
const MODERATE_ROE = 0.12;

/** Capital-allocation scoring (0-100 scale). */
const NEUTRAL_CAPITAL_ALLOCATION_SCORE = 50;
const LOW_ROIC = 0.07;
const SUSTAINABLE_PAYOUT_RATIO = 0.6;
const SHAREHOLDER_RETURN_OVERSPEND_RATIO = 1.2;

/** Risk scoring (0-100 scale, higher = riskier). */
const MIN_RISK_SCORE = 5;
const MAX_RISK_SCORE = 95;
const NEUTRAL_RISK_SCORE = 40;
const NEGATIVE_EQUITY_RISK_SCORE = 90;
/** Debt/Equity is a percentage already; halving maps 100% D/E to ~50 risk. */
const DEBT_TO_EQUITY_RISK_DIVISOR = 2;
const HEALTHY_CURRENT_RATIO = 1.5;
const ADEQUATE_CURRENT_RATIO = 1;
const LIQUIDITY_RISK_HEALTHY = 15;
const LIQUIDITY_RISK_ADEQUATE = 35;
const LIQUIDITY_RISK_STRAINED = 75;
const CASH_FLOW_RISK_POSITIVE = 20;
const CASH_FLOW_RISK_BURN = 80;
/** Maximum factor score; valuation risk is its complement of the valuation score. */
const MAX_FACTOR_SCORE = 100;

/** Thesis bull/bear thresholds (fractions, except D/E which is a percentage). */
const THESIS_STRONG_ROE = 0.18;
const THESIS_HEALTHY_GROSS_MARGIN = 0.45;
const THESIS_STRONG_REVENUE_GROWTH = 0.08;
const THESIS_THIN_NET_MARGIN = 0.05;
const THESIS_ELEVATED_DEBT_TO_EQUITY = 150;
const THESIS_WEAK_VALUATION_SCORE = 45;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** Formats a fraction (0.123) as a percentage string ("12%"). */
const percent = (fraction: number, decimals = 0) => `${(fraction * 100).toFixed(decimals)}%`;

// ---------------------------------------------------------------------------
// 2. Statement assembly
// ---------------------------------------------------------------------------

/** Reads a statement line item, trying known Yahoo field aliases in order. */
const readLineItem = (row: StatementRow | undefined, ...aliases: string[]): number | null => {
  if (!row) return null;
  for (const alias of aliases) {
    const value = getRaw(row[alias]);
    if (value !== null) return value;
  }
  return null;
};

const fiscalYearOf = (row: StatementRow | undefined): number | null => {
  const endDate = row?.endDate as { fmt?: string; raw?: number } | undefined;
  if (endDate?.fmt) {
    const year = parseInt(endDate.fmt.slice(0, 4), 10);
    if (!Number.isNaN(year)) return year;
  }
  if (typeof endDate?.raw === 'number') return new Date(endDate.raw * 1000).getUTCFullYear();
  return null;
};

const indexByFiscalYear = (rows: StatementRow[]): Map<number, StatementRow> => {
  const byYear = new Map<number, StatementRow>();
  for (const row of rows) {
    const year = fiscalYearOf(row);
    if (year !== null) byYear.set(year, row);
  }
  return byYear;
};

/**
 * Builds the multi-year statement history by aligning income, balance-sheet and
 * cash-flow rows on their fiscal year. Returns oldest-first, or an empty array
 * when Yahoo returned no income statements (caller treats that as unavailable).
 */
export function buildFinancialsHistory(
  income: StatementRow[],
  balance: StatementRow[],
  cashflow: StatementRow[]
): FinancialStatementYearly[] {
  if (!income.length) return [];

  const balanceByYear = indexByFiscalYear(balance);
  const cashflowByYear = indexByFiscalYear(cashflow);

  const statements: FinancialStatementYearly[] = [];

  for (const incomeRow of income) {
    const year = fiscalYearOf(incomeRow);
    if (year === null) continue;
    const balanceRow = balanceByYear.get(year);
    const cashflowRow = cashflowByYear.get(year);

    const revenue = readLineItem(incomeRow, 'totalRevenue');
    const grossProfit = readLineItem(incomeRow, 'grossProfit');
    const ebit = readLineItem(incomeRow, 'ebit', 'operatingIncome');
    const incomeBeforeTax = readLineItem(incomeRow, 'incomeBeforeTax');
    const taxExpense = readLineItem(incomeRow, 'incomeTaxExpense');
    const netIncome = readLineItem(incomeRow, 'netIncome');

    const depreciation = readLineItem(cashflowRow, 'depreciation');
    const ebitda = ebit !== null ? ebit + (depreciation ?? 0) : null;

    const operatingCashFlow = readLineItem(cashflowRow, 'totalCashFromOperatingActivities');
    const capex = readLineItem(cashflowRow, 'capitalExpenditures');
    const freeCashFlow = operatingCashFlow !== null ? operatingCashFlow + (capex ?? 0) : null;
    const buybacks = readLineItem(cashflowRow, 'repurchaseOfStock');
    const dividends = readLineItem(cashflowRow, 'dividendsPaid');

    const cash = readLineItem(balanceRow, 'cash', 'cashAndCashEquivalents');
    const longTermDebt = readLineItem(balanceRow, 'longTermDebt');
    const shortTermDebt = readLineItem(balanceRow, 'shortLongTermDebt');
    const totalDebt =
      longTermDebt !== null || shortTermDebt !== null
        ? (longTermDebt ?? 0) + (shortTermDebt ?? 0)
        : null;
    const equity = readLineItem(balanceRow, 'totalStockholderEquity');
    const totalAssets = readLineItem(balanceRow, 'totalAssets');
    const currentAssets = readLineItem(balanceRow, 'totalCurrentAssets');
    const currentLiabilities = readLineItem(balanceRow, 'totalCurrentLiabilities');
    const workingCapital =
      currentAssets !== null && currentLiabilities !== null
        ? currentAssets - currentLiabilities
        : null;

    // ROIC = NOPAT / invested capital. The effective tax rate comes from the
    // filing when derivable, otherwise the default corporate rate is assumed.
    const effectiveTaxRate =
      incomeBeforeTax !== null && incomeBeforeTax !== 0 && taxExpense !== null
        ? clamp(taxExpense / incomeBeforeTax, 0, MAX_DERIVED_TAX_RATE)
        : DEFAULT_EFFECTIVE_TAX_RATE;
    const nopat = ebit !== null ? ebit * (1 - effectiveTaxRate) : null;
    const investedCapital = equity !== null ? (totalDebt ?? 0) + equity - (cash ?? 0) : null;

    statements.push({
      year,
      revenue,
      grossProfit,
      ebitda,
      ebit,
      netIncome,
      operatingCashFlow,
      capex,
      freeCashFlow,
      buybacks,
      dividends,
      cash,
      debt: totalDebt,
      equity,
      workingCapital,
      roe: safeDiv(netIncome, equity),
      roa: safeDiv(netIncome, totalAssets),
      roic: safeDiv(nopat, investedCapital),
      croic: safeDiv(freeCashFlow, investedCapital)
    });
  }

  // Yahoo returns newest-first; present oldest-first for chronological reading.
  return statements.sort((a, b) => a.year - b.year);
}

// ---------------------------------------------------------------------------
// 3. Quantitative models
// ---------------------------------------------------------------------------

const standardDeviation = (values: number[]): number => {
  if (values.length < 2) return 0;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
};

/** Compound annual growth rate over `periods`. Null when inputs are unusable. */
const cagr = (first: number | null, last: number | null, periods: number): number | null => {
  if (first === null || last === null || first <= 0 || last <= 0 || periods <= 0) return null;
  return Math.pow(last / first, 1 / periods) - 1;
};

const classifyTrend = (change: number, band: number): FinancialsMetricsEvolution['trendRevenue'] =>
  change > band ? 'improving' : change < -band ? 'deteriorating' : 'stable';

export function computeEvolutionStats(
  history: FinancialStatementYearly[]
): FinancialsMetricsEvolution {
  const revenues = history
    .map((row) => row.revenue)
    .filter((value): value is number => value !== null);
  const netIncomes = history
    .map((row) => row.netIncome)
    .filter((value): value is number => value !== null);

  const last = <T>(values: T[]): T => values[values.length - 1];

  const cagrRevenue =
    revenues.length >= 2 ? cagr(revenues[0], last(revenues), revenues.length - 1) : null;
  const cagrNetIncome =
    netIncomes.length >= 2 ? cagr(netIncomes[0], last(netIncomes), netIncomes.length - 1) : null;

  const yearOverYearRevenueGrowth: number[] = [];
  for (let i = 1; i < revenues.length; i++) {
    if (revenues[i - 1] > 0) yearOverYearRevenueGrowth.push(revenues[i] / revenues[i - 1] - 1);
  }
  const volatilityRevenue = yearOverYearRevenueGrowth.length
    ? Number(standardDeviation(yearOverYearRevenueGrowth).toFixed(4))
    : null;

  const latestRevenueGrowth = yearOverYearRevenueGrowth.length
    ? last(yearOverYearRevenueGrowth)
    : 0;
  const trendRevenue = classifyTrend(latestRevenueGrowth, REVENUE_TREND_BAND);

  // Margin trend uses the operating margin proxy (EBIT / revenue) at the endpoints.
  const operatingMargins = history
    .filter((row) => row.ebit !== null && row.revenue && row.revenue > 0)
    .map((row) => (row.ebit as number) / (row.revenue as number));
  const trendMargin =
    operatingMargins.length >= 2
      ? classifyTrend(last(operatingMargins) - operatingMargins[0], MARGIN_TREND_BAND)
      : 'stable';

  return {
    cagrRevenue,
    cagrNetIncome,
    volatilityRevenue,
    trendRevenue,
    trendMargin
  };
}

/** Discounted-FCF intrinsic value per share. Null when inputs are unusable. */
const intrinsicValuePerShare = (
  initialFcf: number,
  sharesOutstanding: number,
  growthRate: number,
  discountRate: number,
  terminalGrowthRate = TERMINAL_GROWTH_RATE
): number | null => {
  if (sharesOutstanding <= 0 || discountRate <= terminalGrowthRate) return null;

  let presentValue = 0;
  let projectedFcf = initialFcf;
  for (let year = 1; year <= PROJECTION_YEARS; year++) {
    projectedFcf *= 1 + growthRate;
    presentValue += projectedFcf / Math.pow(1 + discountRate, year);
  }

  const terminalValue =
    (projectedFcf * (1 + terminalGrowthRate)) / (discountRate - terminalGrowthRate);
  presentValue += terminalValue / Math.pow(1 + discountRate, PROJECTION_YEARS);

  return presentValue / sharesOutstanding;
};

/**
 * Real DCF + reverse DCF.
 * - initialFcf : latest real free cash flow
 * - shares     : real shares outstanding
 * - growth     : real growth estimate (fraction)
 * - beta       : drives the CAPM discount rate
 * Returns null when a meaningful model cannot be built (e.g. negative FCF).
 */
export function computeValuationModel(
  price: number | null,
  initialFcf: number | null,
  shares: number | null,
  growth: number | null,
  beta: number | null
): ValuationFramework | null {
  if (price === null || initialFcf === null || initialFcf <= 0 || shares === null || shares <= 0) {
    return null;
  }

  const baseGrowthRate = clamp(
    growth ?? FALLBACK_GROWTH_RATE,
    BASE_GROWTH_BOUNDS.min,
    BASE_GROWTH_BOUNDS.max
  );
  const baseDiscountRate = clamp(
    RISK_FREE_RATE + (beta ?? DEFAULT_BETA) * EQUITY_RISK_PREMIUM,
    BASE_DISCOUNT_RATE_BOUNDS.min,
    BASE_DISCOUNT_RATE_BOUNDS.max
  );

  const buildScenario = (scenario: (typeof DCF_SCENARIOS)[keyof typeof DCF_SCENARIOS]) => {
    const rawGrowthRate = baseGrowthRate + scenario.growthDelta;
    const rawDiscountRate = baseDiscountRate + scenario.discountDelta;
    const growthRate = clamp(rawGrowthRate, SCENARIO_GROWTH_BOUNDS.min, SCENARIO_GROWTH_BOUNDS.max);
    const discountRate = clamp(
      rawDiscountRate,
      SCENARIO_DISCOUNT_RATE_BOUNDS.min,
      SCENARIO_DISCOUNT_RATE_BOUNDS.max
    );
    const intrinsicValue = intrinsicValuePerShare(initialFcf, shares, growthRate, discountRate);
    const terminalSpread = clamp(
      rawDiscountRate - TERMINAL_GROWTH_RATE,
      TERMINAL_SPREAD_BOUNDS.min,
      TERMINAL_SPREAD_BOUNDS.max
    );
    return {
      name: scenario.name,
      intrinsicValue: intrinsicValue !== null ? Number(intrinsicValue.toFixed(2)) : 0,
      growthRate: Number((growthRate * 100).toFixed(1)),
      discountRate: Number((discountRate * 100).toFixed(1)),
      terminalMultiple: Number((1 / terminalSpread).toFixed(1))
    };
  };

  // Reverse DCF: bisect for the implied growth rate that prices the asset today.
  let lowGrowth = IMPLIED_GROWTH_BOUNDS.min;
  let highGrowth = IMPLIED_GROWTH_BOUNDS.max;
  let impliedGrowthRate = baseGrowthRate;
  for (let i = 0; i < REVERSE_DCF_ITERATIONS; i++) {
    const midGrowth = (lowGrowth + highGrowth) / 2;
    const intrinsicValue = intrinsicValuePerShare(initialFcf, shares, midGrowth, baseDiscountRate);
    if (intrinsicValue === null) break;
    if (intrinsicValue > price) highGrowth = midGrowth;
    else lowGrowth = midGrowth;
    impliedGrowthRate = midGrowth;
  }

  return {
    dcfScenarios: {
      bear: buildScenario(DCF_SCENARIOS.bear),
      base: buildScenario(DCF_SCENARIOS.base),
      bull: buildScenario(DCF_SCENARIOS.bull)
    },
    reverseDcf: {
      impliedGrowthRate: Number((impliedGrowthRate * 100).toFixed(1)),
      expectedReturn: Number((baseDiscountRate * 100).toFixed(1))
    },
    currentPrice: price
  };
}

/** Moat tier derived from real profitability + capital-efficiency signals. */
export function deriveMoat(metrics: AssetMetrics): MoatAnalysis {
  const grossMargin = metrics.profitability.grossMargin;
  const roe = metrics.profitability.roe;
  const roic = metrics.profitability.roic;
  const freeCashFlow = metrics.cashFlow.freeCashFlow;

  const factors: string[] = [];
  if (grossMargin !== null && grossMargin >= HIGH_GROSS_MARGIN)
    factors.push(`High gross margin (${percent(grossMargin)}) — pricing power`);
  if (roic !== null && roic >= STRONG_ROIC)
    factors.push(`ROIC ${percent(roic)} above cost of capital`);
  else if (roe !== null && roe >= EXCELLENT_ROE)
    factors.push(`ROE ${percent(roe)} — strong returns on equity`);
  if (freeCashFlow !== null && freeCashFlow > 0) factors.push('Positive free cash flow generation');

  const hasWideMoat =
    (roic !== null && roic >= STRONG_ROIC) ||
    (grossMargin !== null && grossMargin >= HIGH_GROSS_MARGIN && (roe ?? 0) >= SOLID_ROE);
  const hasNarrowMoat =
    (roe !== null && roe >= MODERATE_ROE) ||
    (grossMargin !== null && grossMargin >= MODERATE_GROSS_MARGIN);

  const classification: MoatAnalysis['classification'] = hasWideMoat
    ? 'Wide Moat'
    : hasNarrowMoat
      ? 'Narrow Moat'
      : 'No Moat';

  return {
    classification,
    factors: factors.length
      ? factors
      : ['Insufficient quantitative signal for a durable advantage'],
    description:
      classification === 'Wide Moat'
        ? 'Quantitative signals (high returns on capital and margins) are consistent with a durable competitive advantage.'
        : classification === 'Narrow Moat'
          ? 'Moderate returns and margins suggest a limited but real competitive edge.'
          : 'Current returns and margins do not evidence a structural competitive advantage.'
  };
}

export function deriveCapitalAllocation(
  metrics: AssetMetrics,
  history: FinancialStatementYearly[]
): CapitalAllocationAnalysis {
  const factors: string[] = [];
  let score = NEUTRAL_CAPITAL_ALLOCATION_SCORE;

  const roic = metrics.profitability.roic;
  if (roic !== null) {
    if (roic >= STRONG_ROIC) {
      score += 20;
      factors.push(`High ROIC (${percent(roic)}) on reinvested capital`);
    } else if (roic < LOW_ROIC) {
      score -= 15;
      factors.push(`Low ROIC (${percent(roic)}) on invested capital`);
    }
  }

  const latest = history[history.length - 1];
  if (latest?.freeCashFlow && latest.freeCashFlow > 0) {
    const capitalReturned = Math.abs(latest.buybacks ?? 0) + Math.abs(latest.dividends ?? 0);
    const returnRatio = capitalReturned / latest.freeCashFlow;
    if (returnRatio > 0 && returnRatio <= 1) {
      score += 15;
      factors.push(`Returns ${percent(returnRatio)} of FCF via buybacks/dividends`);
    } else if (returnRatio > SHAREHOLDER_RETURN_OVERSPEND_RATIO) {
      score -= 10;
      factors.push('Shareholder returns exceed free cash flow (funded by debt/cash)');
    }
  }

  const payoutRatio = metrics.dividends.payoutRatio;
  if (payoutRatio !== null && payoutRatio > 0 && payoutRatio < SUSTAINABLE_PAYOUT_RATIO) {
    score += 10;
    factors.push('Sustainable dividend payout (<60%)');
  }

  return {
    score: clamp(Math.round(score), 0, 100),
    factors: factors.length
      ? factors
      : ['Insufficient cash-flow history to assess capital allocation'],
    description: 'Assessment derived from real ROIC, free cash flow and shareholder-return history.'
  };
}

export function deriveRisks(metrics: AssetMetrics, scores: { valuation: number }): RiskAnalysis {
  const factors: RiskAnalysis['factors'] = [];

  const debtToEquity = metrics.leverage.debtToEquity;
  const leverageRisk =
    debtToEquity === null
      ? NEUTRAL_RISK_SCORE
      : debtToEquity < 0
        ? NEGATIVE_EQUITY_RISK_SCORE
        : clamp(
            Math.round(debtToEquity / DEBT_TO_EQUITY_RISK_DIVISOR),
            MIN_RISK_SCORE,
            MAX_RISK_SCORE
          );
  factors.push({
    name: 'Financial / Leverage Risk',
    score: leverageRisk,
    description:
      debtToEquity === null
        ? 'Leverage data unavailable.'
        : debtToEquity < 0
          ? 'Negative shareholder equity — elevated balance-sheet risk.'
          : `Debt/Equity at ${debtToEquity.toFixed(0)}%.`
  });

  factors.push({
    name: 'Valuation Risk',
    score: clamp(MAX_FACTOR_SCORE - scores.valuation, MIN_RISK_SCORE, MAX_RISK_SCORE),
    description: 'Higher when multiples are rich versus the sector benchmark.'
  });

  const currentRatio = metrics.leverage.currentRatio;
  const liquidityRisk =
    currentRatio === null
      ? NEUTRAL_RISK_SCORE
      : currentRatio >= HEALTHY_CURRENT_RATIO
        ? LIQUIDITY_RISK_HEALTHY
        : currentRatio >= ADEQUATE_CURRENT_RATIO
          ? LIQUIDITY_RISK_ADEQUATE
          : LIQUIDITY_RISK_STRAINED;
  factors.push({
    name: 'Liquidity Risk',
    score: liquidityRisk,
    description:
      currentRatio === null
        ? 'Liquidity data unavailable.'
        : `Current ratio ${currentRatio.toFixed(2)}.`
  });

  const freeCashFlow = metrics.cashFlow.freeCashFlow;
  const cashFlowRisk =
    freeCashFlow === null
      ? NEUTRAL_RISK_SCORE
      : freeCashFlow > 0
        ? CASH_FLOW_RISK_POSITIVE
        : CASH_FLOW_RISK_BURN;
  factors.push({
    name: 'Cash-Flow Risk',
    score: cashFlowRisk,
    description:
      freeCashFlow === null
        ? 'Cash-flow data unavailable.'
        : freeCashFlow > 0
          ? 'Positive free cash flow.'
          : 'Negative free cash flow (cash burn).'
  });

  const overallScore = Math.round(
    factors.reduce((sum, factor) => sum + factor.score, 0) / factors.length
  );
  return {
    factors,
    overallScore,
    description:
      'Risk scores are computed from real leverage, liquidity, valuation and cash-flow signals.'
  };
}

/** Neutral, clearly-flagged valuation frame when no meaningful DCF can be built. */
const emptyValuationFramework = (currentPrice: number): ValuationFramework => {
  const emptyScenario = (name: string) => ({
    name,
    intrinsicValue: 0,
    growthRate: 0,
    discountRate: 0,
    terminalMultiple: 0
  });
  return {
    dcfScenarios: {
      bear: emptyScenario('Bear Scenario'),
      base: emptyScenario('Base Scenario'),
      bull: emptyScenario('Bull Scenario')
    },
    reverseDcf: { impliedGrowthRate: 0, expectedReturn: 0 },
    currentPrice
  };
};

export function deriveThesis(
  metrics: AssetMetrics,
  scores: { businessQuality: number; growth: number; financialHealth: number; valuation: number },
  valuation: ValuationFramework | null,
  moat: MoatAnalysis,
  capitalAllocation: CapitalAllocationAnalysis,
  risks: RiskAnalysis,
  fallbackPrice: number
): InvestmentThesis {
  const profitability = metrics.profitability;
  const growth = metrics.growth;
  const debtToEquity = metrics.leverage.debtToEquity;
  const freeCashFlow = metrics.cashFlow.freeCashFlow;

  const bullCase: string[] = [];
  if (profitability.roe !== null && profitability.roe >= THESIS_STRONG_ROE)
    bullCase.push(`Strong ROE of ${percent(profitability.roe)}.`);
  if (
    profitability.grossMargin !== null &&
    profitability.grossMargin >= THESIS_HEALTHY_GROSS_MARGIN
  )
    bullCase.push(`Healthy gross margin of ${percent(profitability.grossMargin)}.`);
  if (
    growth.quarterlyRevenueGrowth !== null &&
    growth.quarterlyRevenueGrowth >= THESIS_STRONG_REVENUE_GROWTH
  )
    bullCase.push(`Revenue growing ${percent(growth.quarterlyRevenueGrowth)} YoY.`);
  if (freeCashFlow !== null && freeCashFlow > 0)
    bullCase.push('Generates positive free cash flow.');

  const bearCase: string[] = [];
  if (profitability.netMargin !== null && profitability.netMargin < THESIS_THIN_NET_MARGIN)
    bearCase.push(`Thin net margin of ${percent(profitability.netMargin, 1)}.`);
  if (debtToEquity !== null && debtToEquity > THESIS_ELEVATED_DEBT_TO_EQUITY)
    bearCase.push(`Elevated leverage (D/E ${debtToEquity.toFixed(0)}%).`);
  if (scores.valuation < THESIS_WEAK_VALUATION_SCORE)
    bearCase.push('Trades at a premium to sector valuation benchmarks.');
  if (growth.quarterlyRevenueGrowth !== null && growth.quarterlyRevenueGrowth < 0)
    bearCase.push('Revenue is contracting year over year.');

  if (!bullCase.length) bullCase.push('No standout quantitative strengths in the current data.');
  if (!bearCase.length) bearCase.push('No major quantitative red flags in the current data.');

  const compositeScore = Math.round(
    (scores.businessQuality + scores.growth + scores.financialHealth + scores.valuation) / 4
  );

  return {
    bullCase,
    bearCase,
    baseCase:
      'Base case follows current fundamentals: returns, growth and leverage holding near present levels.',
    thesisSummary: `Composite fundamental profile scores ${compositeScore}/100 across quality, growth, health and valuation. See factor breakdown for drivers.`,
    moat,
    capitalAllocation,
    risks,
    valuation: valuation ?? emptyValuationFramework(fallbackPrice)
  };
}

/** Research assembled from real profile data only; editorial fields stay empty. */
export function deriveResearch(profile: AssetProfile, recommendation: string): CompanyResearch {
  return {
    history: profile.businessSummary || 'No company description available from the data source.',
    businessModel: profile.businessSummary
      ? `Operates in ${profile.industry || 'its industry'} within the ${profile.sector || 'market'} sector.`
      : 'Business model description not available.',
    keyProducts: [],
    keyCompetitors: [],
    regulatoryRisks: [],
    filingsAnalysis: {
      recentGuidance: recommendation
        ? `Latest analyst consensus recommendation: ${recommendation}.`
        : 'Analyst guidance not available from this source.',
      strategicChanges: 'Not available from this data source.',
      marginComments: 'Not available from this data source.',
      growthOutlook: 'Not available from this data source.'
    },
    dataSource: 'Yahoo Finance',
    dataUpdated: 'Live',
    reliabilityTier: 'Tier 3 (Aggregator)'
  };
}
