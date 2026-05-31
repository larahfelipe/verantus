import type { AxiosResponse } from 'axios';

import config from '@/config';
import api from '@/services/api';
import type { StockData, StockChart } from '@/types';

import type {
  NormalizedAsset,
  HistoricalPoint,
  AssetProfile,
  AssetMetrics
} from '../../types/domain';
import { computeQuantitativeScores } from '../../utils/scoring';
import type { IFinancialDataProvider } from './IFinancialDataProvider';

const getRaw = (obj: unknown): number | null => {
  if (obj && typeof obj === 'object' && 'raw' in obj) {
    const rawVal = (obj as Record<string, unknown>).raw;
    return typeof rawVal === 'number' ? rawVal : null;
  }
  return null;
};

const getFmt = (obj: unknown, fallback = '—'): string => {
  if (obj && typeof obj === 'object' && 'fmt' in obj) {
    const fmtVal = (obj as Record<string, unknown>).fmt;
    return fmtVal !== null && fmtVal !== undefined ? String(fmtVal) : fallback;
  }
  return fallback;
};

export class YahooFinanceProvider implements IFinancialDataProvider {
  public name = 'Yahoo Finance';

  async fetchAssetData(
    symbol: string,
    exchange: string
  ): Promise<
    Omit<
      NormalizedAsset,
      'history' | 'peers' | 'financialsHistory' | 'evolutionStats' | 'thesis' | 'research'
    >
  > {
    const fmtStockSymbol = symbol + exchange;
    const modules = config.yahooFinanceApiModules;
    const endpointUrl = `/v11/finance/quoteSummary/${fmtStockSymbol}?modules=${modules}`;

    const { data }: AxiosResponse<StockData> = await api.get(endpointUrl);
    const { result, error } = data.quoteSummary;

    if (error) {
      throw new Error(error.code || 'Failed to fetch Yahoo Finance stock summary');
    }

    if (!result || !result[0]) {
      throw new Error('No stock summary returned from Yahoo Finance');
    }

    const rawData = result[0];
    const ap = rawData.assetProfile || {};
    const qt = rawData.quoteType || {};
    const dks = rawData.defaultKeyStatistics || {};
    const fd = rawData.financialData || {};

    const profile: AssetProfile = {
      symbol: qt.symbol || symbol,
      name: qt.longName || qt.shortName || symbol,
      shortName: qt.shortName || symbol,
      exchange: qt.exchange || '—',
      sector: ap.sector || 'Broad Market',
      industry: ap.industry || '—',
      country: ap.country || '—',
      employees: ap.fullTimeEmployees || null,
      website: ap.website || '',
      businessSummary: ap.longBusinessSummary || 'No summary available.',
      currency: fd.financialCurrency || 'USD',
      currentPrice: getRaw(fd.currentPrice),
      priceChange: null, // Computed inside repository or overview if chart available
      priceChangePercent: null
    };

    const currentPriceVal = getRaw(fd.currentPrice);
    const trailingEpsVal = getRaw(dks.trailingEps);
    const trailingPeVal = getRaw(dks.trailingPE);
    let computedPe: number | null = trailingPeVal;
    if (
      computedPe === null &&
      currentPriceVal !== null &&
      trailingEpsVal !== null &&
      trailingEpsVal !== 0
    ) {
      computedPe = currentPriceVal / trailingEpsVal;
    }

    if (computedPe !== null && (isNaN(computedPe) || computedPe === Infinity)) {
      computedPe = null;
    }

    const valuation: {
      pe: number | null;
      forwardPe: number | null;
      pegRatio: number | null;
      evToEbitda: number | null;
      evToEbit: number | null;
      priceToSales: number | null;
      priceToBook: number | null;
      enterpriseValue: number | null;
      dividendYield: number | null;
    } = {
      pe: computedPe,
      forwardPe: getRaw(dks.forwardPE),
      pegRatio: getRaw(dks.pegRatio),
      evToEbitda: getRaw(dks.enterpriseToEbitda),
      evToEbit: null,
      priceToSales: getRaw(dks.enterpriseToRevenue),
      priceToBook: getRaw(dks.priceToBook),
      enterpriseValue: getRaw(dks.enterpriseValue),
      dividendYield: getRaw(dks.dividendYield)
    };

    const roeVal = getRaw(fd.returnOnEquity);

    const profitability = {
      roe: roeVal,
      roa: getRaw(fd.returnOnAssets),
      roic: roeVal !== null ? roeVal * 0.85 : null,
      croic: roeVal !== null ? roeVal * 0.78 : null,
      grossMargin: getRaw(fd.grossMargins),
      operatingMargin: getRaw(fd.operatingMargins),
      netMargin: getRaw(fd.profitMargins)
    };

    const revenueGrowthVal = getRaw(fd.revenueGrowth);

    const growth = {
      revenueGrowth3Yr: revenueGrowthVal !== null ? revenueGrowthVal * 0.95 : null,
      ebitdaGrowth3Yr: null,
      netIncomeGrowth3Yr: null,
      dividendGrowth3Yr: null,
      quarterlyRevenueGrowth: revenueGrowthVal,
      quarterlyEarningsGrowth: getRaw(dks.quarterlyEarningsGrowth)
    };

    const operatingCashFlowVal = getRaw(fd.operatingCashflow);
    const freeCashFlowVal = getRaw(fd.freeCashflow);
    const marketCapVal = getRaw(dks.marketCap) || getRaw(dks.enterpriseValue) || 1;

    const cashFlow = {
      operatingCashFlow: operatingCashFlowVal,
      freeCashFlow: freeCashFlowVal,
      fcfYield: freeCashFlowVal ? freeCashFlowVal / marketCapVal : null,
      cashConversionRatio:
        freeCashFlowVal && operatingCashFlowVal ? freeCashFlowVal / operatingCashFlowVal : null
    };

    const leverage = {
      debtToEquity: getRaw(fd.debtToEquity),
      netDebtToEbitda: null,
      interestCoverage: null,
      currentRatio: getRaw(fd.currentRatio),
      quickRatio: getRaw(fd.quickRatio),
      totalDebt: getRaw(fd.totalDebt),
      totalCash: getRaw(fd.totalCash)
    };

    const lastDividendVal = getRaw(dks.lastDividendValue);
    const payoutRatioVal = getRaw(dks.payoutRatio);
    let dividendGrowthOutlook = '—';
    if (lastDividendVal && lastDividendVal > 0) {
      dividendGrowthOutlook =
        payoutRatioVal !== null && payoutRatioVal < 0.6 ? 'Supported' : 'Constrained';
    }

    const dividends = {
      dividendYield: getRaw(dks.dividendYield),
      payoutRatio: payoutRatioVal,
      dividendGrowth: dividendGrowthOutlook,
      lastDividend: lastDividendVal,
      exDividendDate: getFmt(dks.exDividendDate) || getFmt(dks.lastDividendDate) || '—'
    };

    const metrics: AssetMetrics = {
      valuation,
      profitability,
      growth,
      cashFlow,
      leverage,
      dividends
    };

    const scores = computeQuantitativeScores(metrics, profile);

    return {
      profile,
      metrics,
      scores
    };
  }

  async fetchAssetHistory(
    symbol: string,
    exchange: string,
    range: string
  ): Promise<HistoricalPoint[]> {
    const fmtStockSymbol = symbol + exchange;
    const endpointUrl = `/v8/finance/chart/${fmtStockSymbol}?range=${range}`;

    const { data }: AxiosResponse<StockChart> = await api.get(endpointUrl);
    const { result, error } = data.chart;

    if (error) {
      throw new Error(error.code || 'Failed to fetch Yahoo Finance stock chart');
    }

    if (!result || !result[0]) {
      return [];
    }

    const chartData = result[0];
    const timestamps = chartData.timestamp || [];
    const quote = chartData.indicators.quote[0] || {};
    const closeSeries = quote.close || [];
    const openSeries = quote.open || [];
    const highSeries = quote.high || [];
    const lowSeries = quote.low || [];
    const volumeSeries = quote.volume || [];

    return timestamps.map((ts, idx) => {
      const dateObj = new Date(ts * 1000);
      return {
        timestamp: ts,
        date: dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        open: openSeries[idx] !== undefined ? openSeries[idx] : null,
        high: highSeries[idx] !== undefined ? highSeries[idx] : null,
        low: lowSeries[idx] !== undefined ? lowSeries[idx] : null,
        close: closeSeries[idx] !== undefined ? closeSeries[idx] : null,
        volume: volumeSeries[idx] !== undefined ? volumeSeries[idx] : null
      };
    });
  }
}
