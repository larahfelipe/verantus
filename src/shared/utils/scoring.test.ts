import { describe, it, expect } from 'vitest';

import type { AssetMetrics, AssetProfile } from '@/shared/types/domain';

import { computeFundamentalHealthIndex, computeQuantitativeScores } from './scoring';

describe('Quantitative Scoring Engine', () => {
  const baseProfile: AssetProfile = {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    shortName: 'Apple',
    exchange: 'NMS',
    sector: 'Technology',
    industry: 'Consumer Electronics',
    country: 'United States',
    employees: 164000,
    website: 'https://www.apple.com',
    businessSummary: 'Test summary.',
    currency: 'USD',
    currentPrice: 180,
    priceChange: null,
    priceChangePercent: null
  };

  const baseMetrics: AssetMetrics = {
    valuation: {
      pe: 25.0,
      forwardPe: 22.0,
      pegRatio: 1.5,
      evToEbitda: 15.0,
      evToEbit: null,
      priceToSales: 6.0,
      evToSales: 6.5,
      priceToBook: 8.0,
      enterpriseValue: 2000000000000,
      marketCap: 1950000000000,
      dividendYield: 0.005
    },
    profitability: {
      roe: 0.3,
      roa: 0.14,
      roic: 0.25,
      croic: 0.22,
      grossMargin: 0.44,
      operatingMargin: 0.26,
      netMargin: 0.2
    },
    growth: {
      revenueGrowth3Yr: 0.08,
      ebitdaGrowth3Yr: null,
      netIncomeGrowth3Yr: null,
      dividendGrowth3Yr: null,
      quarterlyRevenueGrowth: 0.14,
      quarterlyEarningsGrowth: 0.18
    },
    cashFlow: {
      operatingCashFlow: 100000000000,
      freeCashFlow: 80000000000,
      fcfYield: 0.04,
      cashConversionRatio: 0.8
    },
    leverage: {
      debtToEquity: 120.0,
      netDebtToEbitda: 0.5,
      interestCoverage: 18.0,
      currentRatio: 1.3,
      quickRatio: 1.0,
      totalDebt: 100000000000,
      totalCash: 50000000000
    },
    dividends: {
      dividendYield: 0.005,
      payoutRatio: 0.16,
      dividendGrowth: 'Supported',
      lastDividend: 0.24,
      exDividendDate: 'May 10, 2026'
    }
  };

  it('calculates the consolidated score and logs the methodology audit', () => {
    const scores = computeQuantitativeScores(baseMetrics, baseProfile);
    expect(scores.consolidated).toBeGreaterThan(0);
    expect(scores.consolidated).toBeLessThanOrEqual(100);

    expect(scores.businessQuality.details.length).toBeGreaterThan(0);
    expect(scores.businessQuality.score).toBeGreaterThanOrEqual(50);
    expect(scores.growth.score).toBeGreaterThanOrEqual(50);
  });

  it('produces normalised scores where declared weights govern the result', () => {
    const scores = computeQuantitativeScores(baseMetrics, baseProfile);
    for (const key of [
      'businessQuality',
      'growth',
      'financialHealth',
      'valuation',
      'efficiency'
    ] as const) {
      const comp = scores[key];
      expect(comp.score).toBeGreaterThanOrEqual(0);
      expect(comp.score).toBeLessThanOrEqual(100);

      if (comp.breakdown) {
        const totalWeight = comp.breakdown.reduce((s, b) => s + b.weight, 0);
        expect(totalWeight).toBe(100);
        for (const item of comp.breakdown) {
          expect(item.points).toBeGreaterThanOrEqual(-item.maxPoints);
          expect(item.points).toBeLessThanOrEqual(item.maxPoints);
        }
      }
    }
  });

  it('handles negative or null values gracefully', () => {
    const poorMetrics: AssetMetrics = {
      ...baseMetrics,
      profitability: {
        roe: -0.05,
        roa: -0.02,
        roic: null,
        croic: null,
        grossMargin: 0.1,
        operatingMargin: 0.02,
        netMargin: 0.01
      },
      growth: {
        ...baseMetrics.growth,
        quarterlyRevenueGrowth: -0.1,
        quarterlyEarningsGrowth: -0.25
      }
    };

    const scores = computeQuantitativeScores(poorMetrics, baseProfile);
    expect(scores.consolidated).toBeLessThan(50);
  });

  it('penalises negative Debt/Equity (negative shareholder equity) instead of rewarding it', () => {
    const distressed: AssetMetrics = {
      ...baseMetrics,
      leverage: { ...baseMetrics.leverage, debtToEquity: -120.0 }
    };
    const healthy: AssetMetrics = {
      ...baseMetrics,
      leverage: { ...baseMetrics.leverage, debtToEquity: 30.0 }
    };

    const distressedScores = computeQuantitativeScores(distressed, baseProfile);
    const healthyScores = computeQuantitativeScores(healthy, baseProfile);

    const deItem = distressedScores.financialHealth.breakdown?.find(
      (b) => b.name === 'Debt to Equity Ratio'
    );
    expect(deItem?.points).toBeLessThan(0);
    expect(distressedScores.financialHealth.score).toBeLessThan(
      healthyScores.financialHealth.score
    );
  });

  it('excludes missing metrics from the weighted average rather than defaulting to neutral', () => {
    const sparseMetrics: AssetMetrics = {
      ...baseMetrics,
      profitability: {
        roe: 0.3,
        roa: null,
        roic: null,
        croic: null,
        grossMargin: null,
        operatingMargin: null,
        netMargin: null
      }
    };

    const scores = computeQuantitativeScores(sparseMetrics, baseProfile);
    expect(scores.businessQuality.breakdown?.length).toBe(1);
    expect(scores.businessQuality.score).toBe(100);
  });

  it('displays a benchmark that matches the absolute hurdle used to score the metric', () => {
    const scores = computeQuantitativeScores(baseMetrics, baseProfile);
    const find = (component: keyof typeof scores, name: string) => {
      const comp = scores[component];
      if (typeof comp === 'number') return undefined;
      return comp.breakdown?.find((b) => b.name === name);
    };

    expect(find('businessQuality', 'Return on Assets (ROA)')?.benchmark).toBe('8.0%');
    expect(find('businessQuality', 'Gross Margin')?.benchmark).toBe('50.0%');
    expect(find('businessQuality', 'Net Profit Margin')?.benchmark).toBe('15.0%');
    expect(find('valuation', 'Price to Book (P/B) Ratio')?.benchmark).toBe('2.00');
  });

  it('excludes a data-less dimension from the consolidated rather than scoring it 50', () => {
    const noGrowth: AssetMetrics = {
      ...baseMetrics,
      growth: {
        ...baseMetrics.growth,
        quarterlyRevenueGrowth: null,
        quarterlyEarningsGrowth: null
      }
    };

    const scores = computeQuantitativeScores(noGrowth, baseProfile);
    expect(scores.growth.breakdown?.length).toBe(0);

    const expected = Math.round(
      (scores.businessQuality.score * 0.25 +
        scores.financialHealth.score * 0.25 +
        scores.valuation.score * 0.2 +
        scores.efficiency.score * 0.1) /
        0.8
    );
    expect(scores.consolidated).toBe(expected);
  });

  it('computes the fundamental health index from the same weights, excluding valuation', () => {
    const scores = computeQuantitativeScores(baseMetrics, baseProfile);
    const expected = Math.round(
      (scores.businessQuality.score * 0.25 +
        scores.growth.score * 0.2 +
        scores.financialHealth.score * 0.25 +
        scores.efficiency.score * 0.1) /
        0.8
    );
    expect(computeFundamentalHealthIndex(scores)).toBe(expected);
  });
});
