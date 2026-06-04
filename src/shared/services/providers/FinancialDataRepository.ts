import config from '@/config';
import type { HistoricalPoint, NormalizedAsset } from '@/shared/types/domain';

import { YahooFinanceProvider } from './YahooFinanceProvider';

/** Trading days used to approximate calendar windows on a daily close series. */
const TRADING_DAYS_7D = 6;
const TRADING_DAYS_1M = 22;
const TRADING_DAYS_1Y = 252;

export class FinancialDataRepository {
  private provider = new YahooFinanceProvider();

  private applyRangeReturns(profile: NormalizedAsset['profile'], history: HistoricalPoint[]): void {
    if (history.length <= 1) return;

    const firstClose = history[0].close;
    const lastClose = history[history.length - 1].close;
    if (lastClose === null || firstClose === null) return;

    profile.priceChange ??= Number((lastClose - firstClose).toFixed(2));

    profile.priceChangePercent ??= Number(((lastClose / firstClose - 1) * 100).toFixed(2));

    const windowReturn = (tradingDays: number): number | null => {
      const idx = Math.max(0, history.length - tradingDays);
      const ref = history[idx]?.close;
      if (!ref) return null;
      return Number(((lastClose / ref - 1) * 100).toFixed(2));
    };

    profile.change7dPercent ??= windowReturn(TRADING_DAYS_7D);
    profile.change1mPercent ??= windowReturn(TRADING_DAYS_1M);
    if (profile.change1yPercent && history.length >= TRADING_DAYS_1Y) {
      profile.change1yPercent = windowReturn(TRADING_DAYS_1Y);
    }
  }

  async getAsset(
    symbol: string,
    exchange: string,
    range: string = config.STOCK.DEFAULT_RANGE
  ): Promise<NormalizedAsset> {
    const dataPart = await this.provider.fetchAssetData(symbol, exchange);

    let history: HistoricalPoint[] = [];
    try {
      history = await this.provider.fetchAssetHistory(symbol, exchange, range);
    } catch (err) {
      console.warn('Price history unavailable from provider.', err);
    }

    this.applyRangeReturns(dataPart.profile, history);

    return { ...dataPart, history };
  }

  async getAssetHistory(
    symbol: string,
    exchange: string,
    range: string
  ): Promise<HistoricalPoint[]> {
    return this.provider.fetchAssetHistory(symbol, exchange, range);
  }
}

export const financialRepository = new FinancialDataRepository();
