import type { NormalizedAsset, HistoricalPoint } from '@/shared/types/domain';

export interface IFinancialDataProvider {
  name: string;
  fetchAssetData(symbol: string, exchange: string): Promise<Omit<NormalizedAsset, 'history'>>;
  fetchAssetHistory(symbol: string, exchange: string, range: string): Promise<HistoricalPoint[]>;
}
