import { describe, it, expect } from 'vitest';

import type { AssetMetrics, AssetProfile } from '../types/domain';
import { computeQuantitativeScores } from './scoring';

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
      priceToBook: 8.0,
      enterpriseValue: 2000000000000,
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
    expect(scores.businessQuality.score).toBeGreaterThanOrEqual(50); // should be strong because of high ROE/ROA
    expect(scores.growth.score).toBeGreaterThanOrEqual(50); // 14% rev growth / 18% earn growth
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
});
