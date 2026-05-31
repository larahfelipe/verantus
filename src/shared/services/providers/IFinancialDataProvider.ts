import type { NormalizedAsset, HistoricalPoint } from '../../types/domain';

export interface IFinancialDataProvider {
  name: string;
  fetchAssetData(
    symbol: string,
    exchange: string
  ): Promise<Omit<NormalizedAsset, 'history' | 'peers'>>;
  fetchAssetHistory(symbol: string, exchange: string, range: string): Promise<HistoricalPoint[]>;
}
