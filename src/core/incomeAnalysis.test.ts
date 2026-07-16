import { describe, expect, it } from 'vitest';

import type { FinancialStatementYearly } from '@/shared/types/domain';

import { computeIncomeStatementAnalysis } from './incomeAnalysis';

const statement = (
  year: number,
  revenue: number | null,
  grossProfit: number | null,
  ebit: number | null,
  netIncome: number | null
): FinancialStatementYearly => ({
  year,
  revenue,
  grossProfit,
  ebitda: null,
  ebit,
  netIncome,
  operatingCashFlow: null,
  capex: null,
  freeCashFlow: null,
  buybacks: null,
  dividends: null,
  cash: null,
  debt: null,
  equity: null,
  workingCapital: null,
  roe: null,
  roa: null,
  roic: null,
  croic: null
});

describe('computeIncomeStatementAnalysis', () => {
  it('computes net margin per year and flags an improving trend', () => {
    const result = computeIncomeStatementAnalysis([
      statement(2023, 100, 0, 0, 10),
      statement(2024, 200, 0, 0, 60)
    ]);

    expect(result.years[0]).toMatchObject({ year: 2023, revenue: 100, netIncome: 10 });
    expect(result.years[0].netMargin).toBeCloseTo(0.1, 10);
    expect(result.years[1].netMargin).toBeCloseTo(0.3, 10);
    expect(result.netMarginTrend).toBe('improving');
  });

  it('flags a deteriorating trend when net margin compresses', () => {
    const result = computeIncomeStatementAnalysis([
      statement(2023, 100, 0, 0, 20),
      statement(2024, 100, 0, 0, 5)
    ]);
    expect(result.netMarginTrend).toBe('deteriorating');
  });

  it('treats a move within the dead-band as stable', () => {
    const result = computeIncomeStatementAnalysis([
      statement(2023, 100, 0, 0, 10),
      statement(2024, 100, 0, 0, 10.5)
    ]);
    expect(result.netMarginTrend).toBe('stable');
  });

  it('returns a null margin for a year with missing or zero revenue', () => {
    const result = computeIncomeStatementAnalysis([
      statement(2023, null, 0, 0, 10),
      statement(2024, 0, 0, 0, 10)
    ]);
    expect(result.years[0].netMargin).toBeNull();
    expect(result.years[1].netMargin).toBeNull();
  });

  it('skips null points and still trends from the first to last available year', () => {
    const result = computeIncomeStatementAnalysis([
      statement(2022, 100, 0, 0, 10),
      statement(2023, null, null, null, null),
      statement(2024, 100, 0, 0, 25)
    ]);
    expect(result.netMarginTrend).toBe('improving');
  });

  it('is stable with fewer than two comparable points', () => {
    expect(computeIncomeStatementAnalysis([statement(2024, 100, 0, 0, 10)]).netMarginTrend).toBe(
      'stable'
    );
  });

  it('handles empty history', () => {
    const result = computeIncomeStatementAnalysis([]);
    expect(result.years).toEqual([]);
    expect(result.netMarginTrend).toBe('stable');
  });
});
