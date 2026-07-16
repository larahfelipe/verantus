import { describe, expect, it } from 'vitest';

import type { FinancialStatementYearly } from '@/shared/types/domain';

import { computeEvolutionStats } from './analysis';

const statement = (
  year: number,
  revenue: number | null,
  netIncome: number | null,
  ebit: number | null
): FinancialStatementYearly => ({
  year,
  revenue,
  grossProfit: null,
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

describe('computeEvolutionStats', () => {
  it('computes revenue and net-income CAGR and an improving operating-margin trend', () => {
    const stats = computeEvolutionStats([
      statement(2022, 100, 10, 10),
      statement(2023, 110, 12, 13),
      statement(2024, 121, 15, 20)
    ]);

    expect(stats.cagrRevenue).toBeCloseTo(0.1, 4);
    expect(stats.cagrNetIncome).toBeGreaterThan(0);
    expect(stats.volatilityRevenue).not.toBeNull();
    expect(stats.trendRevenue).toBe('improving');
    expect(stats.trendMargin).toBe('improving');
  });

  it('flags a deteriorating operating-margin trend', () => {
    const stats = computeEvolutionStats([statement(2023, 100, 20, 30), statement(2024, 100, 5, 5)]);
    expect(stats.trendMargin).toBe('deteriorating');
  });

  it('returns null CAGR and stable trends when there is too little data', () => {
    const stats = computeEvolutionStats([statement(2024, 100, 10, 10)]);
    expect(stats.cagrRevenue).toBeNull();
    expect(stats.cagrNetIncome).toBeNull();
    expect(stats.volatilityRevenue).toBeNull();
    expect(stats.trendRevenue).toBe('stable');
    expect(stats.trendMargin).toBe('stable');
  });

  it('ignores negative endpoints that make CAGR undefined', () => {
    const stats = computeEvolutionStats([
      statement(2023, -100, -10, -5),
      statement(2024, 120, 15, 20)
    ]);
    expect(stats.cagrRevenue).toBeNull();
  });
});
