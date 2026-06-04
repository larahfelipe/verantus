import { computed, toValue, type MaybeRefOrGetter } from 'vue';

import type { NormalizedAsset, ScoreComponent } from '@/shared/types/domain';
import { computeFundamentalHealthIndex } from '@/shared/utils/scoring';

import {
  assessmentText,
  factorChipClass,
  headlineBadgeClass,
  healthBarClass,
  letterGrade,
  type GradeLetter
} from '../utils/grading';

/** Score used when an asset (or dimension) has no evaluable data. */
const NEUTRAL_SCORE = 50;

/** Narrative thresholds for the executive summary (presentation only). */
const STRONG_NARRATIVE = 75;
const MODERATE_NARRATIVE = 55;
const GROWTH_STRONG = 75;
const GROWTH_MODERATE = 55;
const VALUATION_DISCOUNT = 70;
const VALUATION_FAIR = 50;

/** Per-factor interpretation thresholds. */
const OUTSTANDING_QUALITY = 75;
const HIGH_GROWTH = 70;
const UNDERVALUED = 60;
const LOW_LEVERAGE = 75;
const EFFICIENT_OPS = 65;

/** Benchmark comparison thresholds (per-factor score vs sector). */
const ABOVE_BENCHMARK = 65;
const IN_LINE_BENCHMARK = 50;

/** Driver inclusion: a metric is a catalyst/headwind when it clears these fractions of its weight. */
const POSITIVE_DRIVER_FRACTION = 0.6;
const NEGATIVE_DRIVER_FRACTION = -0.4;
const MAX_DRIVERS = 4;
const MAX_BENCHMARK_ROWS = 6;

const FACTOR_ORDER = [
  'businessQuality',
  'growth',
  'valuation',
  'financialHealth',
  'efficiency'
] as const;

type FactorKey = (typeof FACTOR_ORDER)[number];

export interface DimensionMeta {
  key: FactorKey;
  label: string;
  score: number;
  grade: GradeLetter;
  gradeClass: string;
  interpretation: string;
  comparison: string;
}

export interface AuditTrailItem {
  text: string;
  isPositive: boolean;
}

export interface ScoreDrivers {
  positive: string[];
  negative: string[];
}

export interface BenchmarkComparison {
  name: string;
  value: string;
  benchmark: string;
}

/** "businessQuality" -> "Business Quality". */
const humanizeKey = (key: string): string => {
  const spaced = key.replace(/([A-Z])/g, ' $1');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

/** Driver chips favour brevity (drop the trailing "Ratio"). */
const cleanDriverName = (name: string): string => name.replace(' (ROE)', '').replace(' Ratio', '');

/** Benchmark rows keep the ratio noun but drop parenthetical qualifiers. */
const cleanComparisonName = (name: string): string =>
  name.replace(' (ROE)', '').replace(' (Trailing/Forward)', '').replace(' (P/B)', '');

const interpretationFor = (key: FactorKey, score: number): string => {
  switch (key) {
    case 'businessQuality':
      return score >= OUTSTANDING_QUALITY ? 'Outstanding margins' : 'Standard profitability';
    case 'growth':
      return score >= HIGH_GROWTH ? 'High-growth momentum' : 'Flat growth';
    case 'valuation':
      return score >= UNDERVALUED ? 'Undervalued / cheap' : 'Premium multiple pricing';
    case 'financialHealth':
      return score >= LOW_LEVERAGE ? 'Low leverage risk' : 'Elevated liabilities';
    case 'efficiency':
      return score >= EFFICIENT_OPS ? 'Efficient operations' : 'Average efficiency';
  }
};

const comparisonFor = (key: FactorKey, score: number): string => {
  if (key === 'valuation') return score >= UNDERVALUED ? 'Discount vs Sector' : 'Premium vs Sector';
  if (score >= ABOVE_BENCHMARK) return 'Above Benchmark';
  if (score >= IN_LINE_BENCHMARK) return 'In Line';
  return 'Below Benchmark';
};

/** Maps a scored component's audit log lines to positive/negative findings. */
export const buildAuditTrail = (component: ScoreComponent | null): AuditTrailItem[] => {
  if (!component) return [];
  const pointsByExplanation = new Map<string, number>();
  for (const item of component.breakdown ?? []) {
    pointsByExplanation.set(item.explanation, item.points);
  }
  return (component.details ?? []).map((log) => ({
    text: log,
    isPositive: (pointsByExplanation.get(log) ?? 0) >= 0
  }));
};

export function useFundamentalRating(assetRef: MaybeRefOrGetter<NormalizedAsset | null>) {
  const scoresOf = () => toValue(assetRef)?.scores ?? null;

  const consolidatedScore = computed(() => scoresOf()?.consolidated ?? NEUTRAL_SCORE);
  const gradeLabel = computed(() => letterGrade(consolidatedScore.value));
  const gradeBadgeClass = computed(() => headlineBadgeClass(consolidatedScore.value));
  const assessment = computed(() => assessmentText(consolidatedScore.value));

  const fundamentalHealthScore = computed(() => {
    const scores = scoresOf();
    return scores ? computeFundamentalHealthIndex(scores) : 0;
  });
  const healthBarColor = computed(() => healthBarClass(fundamentalHealthScore.value));

  const dimensions = computed<DimensionMeta[]>(() => {
    const scores = scoresOf();
    if (!scores) return [];
    return FACTOR_ORDER.map((key) => {
      const score = scores[key].score;
      return {
        key,
        label: humanizeKey(key),
        score,
        grade: letterGrade(score),
        gradeClass: factorChipClass(score),
        interpretation: interpretationFor(key, score),
        comparison: comparisonFor(key, score)
      };
    });
  });

  const executiveSummary = computed(() => {
    const scores = scoresOf();
    if (!scores) return '';

    const quality = scores.businessQuality.score;
    const growth = scores.growth.score;
    const health = scores.financialHealth.score;
    const valuation = scores.valuation.score;

    const parts: string[] = [];
    if (quality >= STRONG_NARRATIVE) {
      parts.push('exceptional operational profitability and high returns on capital');
    } else if (quality >= MODERATE_NARRATIVE) {
      parts.push('solid business quality and stable margin generation');
    } else {
      parts.push('sub-par profitability ratios and compressed margins');
    }

    if (health >= STRONG_NARRATIVE) {
      parts.push('outstanding balance sheet quality with robust liquidity buffers');
    } else if (health >= MODERATE_NARRATIVE) {
      parts.push('acceptable leverage structure and normal liquidity cushions');
    } else {
      parts.push('potential capital structure weaknesses and tight near-term solvency');
    }

    if (growth >= GROWTH_STRONG) {
      parts.push('accelerating top and bottom-line expansion velocities');
    } else if (growth >= GROWTH_MODERATE) {
      parts.push('moderate growth momentum');
    } else {
      parts.push('slowing growth dynamics');
    }

    const strengths = `The asset exhibits ${parts.slice(0, -1).join(', ')}, alongside ${parts.slice(-1)}.`;

    let valuationNote: string;
    if (valuation >= VALUATION_DISCOUNT) {
      valuationNote =
        'Current valuation multiples trade at a substantial discount, offering an attractive entry margin of safety.';
    } else if (valuation >= VALUATION_FAIR) {
      valuationNote =
        'Trading multiples are generally aligned with historical sector averages, reflecting fair pricing.';
    } else {
      valuationNote = 'However, premium multiples restrict the immediate margin of safety.';
    }

    return `${strengths} ${valuationNote}`;
  });

  const evaluatedItems = () => {
    const scores = scoresOf();
    if (!scores) return [];
    return FACTOR_ORDER.flatMap((key) => scores[key].breakdown ?? []);
  };

  const scoreDrivers = computed<ScoreDrivers>(() => {
    const positive: string[] = [];
    const negative: string[] = [];
    for (const item of evaluatedItems()) {
      const fraction = item.maxPoints > 0 ? item.points / item.maxPoints : 0;
      if (fraction >= POSITIVE_DRIVER_FRACTION) positive.push(cleanDriverName(item.name));
      else if (fraction <= NEGATIVE_DRIVER_FRACTION) negative.push(cleanDriverName(item.name));
    }
    return {
      positive: [...new Set(positive)].slice(0, MAX_DRIVERS),
      negative: [...new Set(negative)].slice(0, MAX_DRIVERS)
    };
  });

  const benchmarkComparisons = computed<BenchmarkComparison[]>(() =>
    evaluatedItems()
      .map((item) => ({
        name: cleanComparisonName(item.name),
        value: item.value,
        benchmark: item.benchmark
      }))
      .slice(0, MAX_BENCHMARK_ROWS)
  );

  return {
    consolidatedScore,
    gradeLabel,
    gradeBadgeClass,
    assessment,
    executiveSummary,
    fundamentalHealthScore,
    healthBarColor,
    dimensions,
    scoreDrivers,
    benchmarkComparisons
  };
}
