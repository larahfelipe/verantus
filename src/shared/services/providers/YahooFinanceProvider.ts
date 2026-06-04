import type { AxiosResponse } from 'axios';

import config from '@/config';
import api from '@/services/api';
import type {
  AssetMetrics,
  AssetProfile,
  HistoricalPoint,
  NormalizedAsset
} from '@/shared/types/domain';
import { computeQuantitativeScores } from '@/shared/utils/scoring';
import type { StockChart, StockData } from '@/types';

import {
  buildFinancialsHistory,
  computeEvolutionStats,
  computeValuationModel,
  deriveCapitalAllocation,
  deriveMoat,
  deriveResearch,
  deriveRisks,
  deriveThesis
} from './deriveAnalysis';
import type { IFinancialDataProvider } from './IFinancialDataProvider';
import { getFmt, getRaw, normalizeYield } from './yahooParse';

type Row = Record<string, unknown>;

function formatChartLabel(timestampSeconds: number, range: string): string {
  const date = new Date(timestampSeconds * 1000);
  if (range === '1d') {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
  if (config.YAHOO_FINANCE.INTRADAY_RANGES.has(range)) {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** Yahoo returns ratio changes as fractions; convert to a 2-decimal percentage number, keeping null. */
function fractionToPercent(fraction: number | null): number | null {
  return fraction !== null ? Number((fraction * 100).toFixed(2)) : null;
}

export class YahooFinanceProvider implements IFinancialDataProvider {
  public name = 'Yahoo Finance';

  async fetchAssetData(
    symbol: string,
    exchange: string
  ): Promise<Omit<NormalizedAsset, 'history'>> {
    const qualifiedSymbol = symbol + exchange;
    const modules = config.YAHOO_FINANCE.API_MODULES;
    const endpointUrl = `/v11/finance/quoteSummary/${qualifiedSymbol}?modules=${modules}`;

    const { data }: AxiosResponse<StockData> = await api.get(endpointUrl);
    const { result, error } = data.quoteSummary;

    if (error) {
      throw new Error(error.code || 'Failed to fetch Yahoo Finance stock summary');
    }

    if (!result?.[0]) {
      throw new Error('No stock summary returned from Yahoo Finance');
    }

    const rawData = result[0];
    const assetProfile = rawData.assetProfile || {};
    const quoteType = rawData.quoteType || {};
    const keyStatistics = rawData.defaultKeyStatistics || {};
    const financialData = rawData.financialData || {};
    const summaryDetail = (rawData.summaryDetail ?? {}) as Row;
    const priceModule = (rawData.price ?? {}) as Row;

    const currentPrice =
      getRaw(priceModule.regularMarketPrice) ?? getRaw(financialData.currentPrice);

    const profile: AssetProfile = {
      symbol: quoteType.symbol || symbol,
      name: quoteType.longName || quoteType.shortName || symbol,
      shortName: quoteType.shortName || symbol,
      exchange: quoteType.exchange || '—',
      sector: assetProfile.sector || 'Broad Market',
      industry: assetProfile.industry || '—',
      country: assetProfile.country || '—',
      employees: assetProfile.fullTimeEmployees || null,
      website: assetProfile.website || '',
      businessSummary: assetProfile.longBusinessSummary || 'No summary available.',
      currency: financialData.financialCurrency || (priceModule.currency as string) || 'USD',
      currentPrice,
      priceChange: getRaw(priceModule.regularMarketChange),
      priceChangePercent: fractionToPercent(getRaw(priceModule.regularMarketChangePercent)),
      change1yPercent: fractionToPercent(getRaw(keyStatistics['52WeekChange']))
    };

    const trailingEps = getRaw(keyStatistics.trailingEps);
    let trailingPe: number | null =
      getRaw(summaryDetail.trailingPE) ?? getRaw(keyStatistics.trailingPE);
    if (trailingPe === null && currentPrice !== null && trailingEps !== null && trailingEps !== 0) {
      trailingPe = currentPrice / trailingEps;
    }

    const sharesOutstanding = getRaw(keyStatistics.sharesOutstanding);
    const enterpriseValue = getRaw(keyStatistics.enterpriseValue);
    const marketCap =
      getRaw(priceModule.marketCap) ??
      getRaw(summaryDetail.marketCap) ??
      (currentPrice !== null && sharesOutstanding !== null && sharesOutstanding > 0
        ? currentPrice * sharesOutstanding
        : null);

    const totalRevenue = getRaw(financialData.totalRevenue);
    // Equity-based P/S; EV/Sales (enterprise-based) is tracked separately below.
    const priceToSales =
      getRaw(summaryDetail.priceToSalesTrailing12Months) ??
      (marketCap !== null && totalRevenue !== null && totalRevenue > 0
        ? marketCap / totalRevenue
        : null);

    const income = (rawData.incomeStatementHistory?.incomeStatementHistory ?? []) as Row[];
    const balance = (rawData.balanceSheetHistory?.balanceSheetStatements ?? []) as Row[];
    const cashflow = (rawData.cashflowStatementHistory?.cashflowStatements ?? []) as Row[];
    const financialsHistory = buildFinancialsHistory(income, balance, cashflow);
    const evolutionStats = computeEvolutionStats(financialsHistory);
    const latest = financialsHistory[financialsHistory.length - 1];

    const operatingCashFlow =
      getRaw(financialData.operatingCashflow) ?? latest?.operatingCashFlow ?? null;
    const freeCashFlow = getRaw(financialData.freeCashflow) ?? latest?.freeCashFlow ?? null;
    const revenueGrowth = getRaw(financialData.revenueGrowth);
    const dividendYield = normalizeYield(
      getRaw(summaryDetail.dividendYield) ?? getRaw(keyStatistics.dividendYield)
    );

    const valuation = {
      pe: trailingPe,
      forwardPe: getRaw(summaryDetail.forwardPE) ?? getRaw(keyStatistics.forwardPE),
      pegRatio: getRaw(keyStatistics.pegRatio),
      evToEbitda: getRaw(keyStatistics.enterpriseToEbitda),
      evToEbit: null,
      priceToSales,
      evToSales: getRaw(keyStatistics.enterpriseToRevenue),
      priceToBook: getRaw(keyStatistics.priceToBook),
      enterpriseValue,
      marketCap,
      dividendYield
    };

    const profitability = {
      roe: getRaw(financialData.returnOnEquity),
      roa: getRaw(financialData.returnOnAssets),
      // ROIC/CROIC from the latest statement year (NOPAT / invested capital).
      roic: latest?.roic ?? null,
      croic: latest?.croic ?? null,
      grossMargin: getRaw(financialData.grossMargins),
      operatingMargin: getRaw(financialData.operatingMargins),
      netMargin: getRaw(financialData.profitMargins)
    };

    const growth = {
      revenueGrowth3Yr: evolutionStats.cagrRevenue,
      ebitdaGrowth3Yr: null,
      netIncomeGrowth3Yr: evolutionStats.cagrNetIncome,
      dividendGrowth3Yr: null,
      quarterlyRevenueGrowth: revenueGrowth,
      quarterlyEarningsGrowth: getRaw(keyStatistics.quarterlyEarningsGrowth)
    };

    const cashFlow = {
      operatingCashFlow,
      freeCashFlow,
      // FCF yield is measured against equity value (market cap), not enterprise value.
      fcfYield:
        freeCashFlow !== null && marketCap !== null && marketCap > 0
          ? freeCashFlow / marketCap
          : null,
      cashConversionRatio:
        freeCashFlow !== null && operatingCashFlow !== null && operatingCashFlow !== 0
          ? freeCashFlow / operatingCashFlow
          : null
    };

    const leverage = {
      debtToEquity: getRaw(financialData.debtToEquity),
      netDebtToEbitda: null,
      interestCoverage: null,
      currentRatio: getRaw(financialData.currentRatio),
      quickRatio: getRaw(financialData.quickRatio),
      totalDebt: getRaw(financialData.totalDebt),
      totalCash: getRaw(financialData.totalCash)
    };

    const lastDividend = getRaw(keyStatistics.lastDividendValue);
    const payoutRatio = getRaw(summaryDetail.payoutRatio) ?? getRaw(keyStatistics.payoutRatio);
    let dividendGrowthOutlook = '—';
    if (lastDividend && lastDividend > 0) {
      dividendGrowthOutlook =
        payoutRatio !== null && payoutRatio < 0.6 ? 'Supported' : 'Constrained';
    }

    const dividends = {
      dividendYield,
      payoutRatio,
      dividendGrowth: dividendGrowthOutlook,
      lastDividend,
      exDividendDate:
        getFmt(summaryDetail.exDividendDate) ||
        getFmt(keyStatistics.exDividendDate) ||
        getFmt(keyStatistics.lastDividendDate) ||
        '—'
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

    const valuationModel = computeValuationModel(
      currentPrice,
      freeCashFlow,
      sharesOutstanding,
      growth.revenueGrowth3Yr ?? growth.quarterlyRevenueGrowth,
      getRaw(summaryDetail.beta)
    );
    const moat = deriveMoat(metrics);
    const capitalAllocation = deriveCapitalAllocation(metrics, financialsHistory);
    const risks = deriveRisks(metrics, { valuation: scores.valuation.score });
    const thesis = deriveThesis(
      metrics,
      {
        businessQuality: scores.businessQuality.score,
        growth: scores.growth.score,
        financialHealth: scores.financialHealth.score,
        valuation: scores.valuation.score
      },
      valuationModel,
      moat,
      capitalAllocation,
      risks,
      currentPrice ?? 0
    );
    const research = deriveResearch(profile, financialData.recommendationKey || '');

    return {
      profile,
      metrics,
      scores,
      financialsHistory,
      evolutionStats,
      thesis,
      research,
      provenance: {
        fundamentals: 'live',
        financials: 'live',
        valuationModel: 'derived',
        thesis: 'derived',
        research: 'live'
      }
    };
  }

  async fetchAssetHistory(
    symbol: string,
    exchange: string,
    range: string
  ): Promise<HistoricalPoint[]> {
    const qualifiedSymbol = symbol + exchange;
    const interval =
      config.YAHOO_FINANCE.RANGE_INTERVALS[range] ?? config.YAHOO_FINANCE.FALLBACK_CHART_INTERVAL;
    const endpointUrl = `/v8/finance/chart/${qualifiedSymbol}?range=${range}&interval=${interval}`;

    const { data }: AxiosResponse<StockChart> = await api.get(endpointUrl);
    const { result, error } = data.chart;

    if (error) {
      throw new Error(error.code || 'Failed to fetch Yahoo Finance stock chart');
    }

    if (!result?.[0]) {
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

    return timestamps.map((timestamp, index) => ({
      timestamp,
      date: formatChartLabel(timestamp, range),
      open: openSeries[index] ?? null,
      high: highSeries[index] ?? null,
      low: lowSeries[index] ?? null,
      close: closeSeries[index] ?? null,
      volume: volumeSeries[index] ?? null
    }));
  }
}
