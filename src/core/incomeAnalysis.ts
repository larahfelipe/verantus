import type {
  FinancialStatementYearly,
  IncomeStatementAnalysis,
  IncomeStatementYearBreakdown,
  MetricTrend
} from '@/shared/types/domain';

/** A margin move within ±1 percentage point over the window counts as stable. */
const MARGIN_TREND_BAND = 0.01;

const ratio = (numerator: number | null, denominator: number | null): number | null =>
  numerator !== null && denominator !== null && denominator !== 0 ? numerator / denominator : null;

const classifyTrend = (first: number, last: number): MetricTrend => {
  const delta = last - first;
  if (delta > MARGIN_TREND_BAND) return 'improving';
  if (delta < -MARGIN_TREND_BAND) return 'deteriorating';
  return 'stable';
};

/** Compares the first and last available (non-null) points of a margin series. */
const trendOf = (
  years: IncomeStatementYearBreakdown[],
  pick: (year: IncomeStatementYearBreakdown) => number | null
): MetricTrend => {
  const points = years.map(pick).filter((value): value is number => value !== null);
  return points.length >= 2 ? classifyTrend(points[0], points[points.length - 1]) : 'stable';
};

/**
 * Net margin (net income over revenue) per year, plus its trend. Only revenue
 * and net income are reported as real figures by the current source — gross
 * profit and EBIT come back zeroed — so gross/operating margins are deliberately
 * not derived. Any year with a missing or zero denominator yields null so the UI
 * renders "—".
 *
 * Expects `history` oldest-first (as produced by the normalization layer) so the
 * trend reads first → last chronologically.
 */
export function computeIncomeStatementAnalysis(
  history: FinancialStatementYearly[]
): IncomeStatementAnalysis {
  const years: IncomeStatementYearBreakdown[] = history.map(({ year, revenue, netIncome }) => ({
    year,
    revenue,
    netIncome,
    netMargin: ratio(netIncome, revenue)
  }));

  return {
    years,
    netMarginTrend: trendOf(years, (y) => y.netMargin)
  };
}
