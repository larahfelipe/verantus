import type { NormalizedAsset, HistoricalPoint, PeerBenchmark } from '../../types/domain';
import { MockDataProvider } from './MockDataProvider';
import { YahooFinanceProvider } from './YahooFinanceProvider';

export class FinancialDataRepository {
  private providers = [new YahooFinanceProvider(), new MockDataProvider()];

  private getPeersForSector(sector: string, currency: string): PeerBenchmark[] {
    const isBrl = currency === 'BRL';

    if (sector === 'Technology') {
      return [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          metrics: {
            pe: 27.5,
            roe: 1.54,
            netMargin: 0.26,
            debtToEquity: 140,
            currentRatio: 1.1,
            dividendYield: 0.005
          }
        },
        {
          symbol: 'MSFT',
          name: 'Microsoft Corp.',
          metrics: {
            pe: 35.8,
            roe: 0.38,
            netMargin: 0.35,
            debtToEquity: 45,
            currentRatio: 1.8,
            dividendYield: 0.007
          }
        },
        {
          symbol: 'GOOGL',
          name: 'Alphabet Inc.',
          metrics: {
            pe: 24.2,
            roe: 0.27,
            netMargin: 0.24,
            debtToEquity: 10,
            currentRatio: 2.1,
            dividendYield: 0.002
          }
        },
        {
          symbol: 'NVDA',
          name: 'NVIDIA Corp.',
          metrics: {
            pe: 65.4,
            roe: 0.89,
            netMargin: 0.48,
            debtToEquity: 18,
            currentRatio: 3.5,
            dividendYield: 0.0003
          }
        }
      ];
    } else if (sector === 'Energy') {
      return [
        {
          symbol: isBrl ? 'PETR4.SA' : 'PETR4',
          name: 'Petrobras S.A.',
          metrics: {
            pe: 4.5,
            roe: 0.28,
            netMargin: 0.18,
            debtToEquity: 85,
            currentRatio: 1.1,
            dividendYield: 0.142
          }
        },
        {
          symbol: 'XOM',
          name: 'Exxon Mobil Corp.',
          metrics: {
            pe: 12.8,
            roe: 0.16,
            netMargin: 0.11,
            debtToEquity: 20,
            currentRatio: 1.4,
            dividendYield: 0.033
          }
        },
        {
          symbol: 'CVX',
          name: 'Chevron Corp.',
          metrics: {
            pe: 13.5,
            roe: 0.14,
            netMargin: 0.1,
            debtToEquity: 15,
            currentRatio: 1.3,
            dividendYield: 0.041
          }
        },
        {
          symbol: 'BP',
          name: 'BP plc',
          metrics: {
            pe: 8.8,
            roe: 0.11,
            netMargin: 0.06,
            debtToEquity: 55,
            currentRatio: 1.2,
            dividendYield: 0.049
          }
        }
      ];
    } else if (sector === 'Basic Materials') {
      return [
        {
          symbol: isBrl ? 'VALE3.SA' : 'VALE3',
          name: 'Vale S.A.',
          metrics: {
            pe: 7.2,
            roe: 0.22,
            netMargin: 0.16,
            debtToEquity: 50,
            currentRatio: 1.3,
            dividendYield: 0.082
          }
        },
        {
          symbol: 'BHP',
          name: 'BHP Group',
          metrics: {
            pe: 11.4,
            roe: 0.24,
            netMargin: 0.18,
            debtToEquity: 45,
            currentRatio: 1.5,
            dividendYield: 0.054
          }
        },
        {
          symbol: 'RIO',
          name: 'Rio Tinto Group',
          metrics: {
            pe: 9.8,
            roe: 0.18,
            netMargin: 0.13,
            debtToEquity: 35,
            currentRatio: 1.6,
            dividendYield: 0.061
          }
        }
      ];
    } else if (sector === 'Communication Services') {
      return [
        {
          symbol: isBrl ? 'TIMS3.SA' : 'TMUS',
          name: isBrl ? 'TIM S.A.' : 'T-Mobile US, Inc.',
          metrics: {
            pe: 16.2,
            roe: 0.12,
            netMargin: 0.11,
            debtToEquity: 55,
            currentRatio: 1.1,
            dividendYield: 0.045
          }
        },
        {
          symbol: isBrl ? 'VIVT3.SA' : 'VZ',
          name: isBrl ? 'Telefônica Brasil S.A.' : 'Verizon Communications',
          metrics: {
            pe: 14.5,
            roe: 0.11,
            netMargin: 0.1,
            debtToEquity: 125,
            currentRatio: 0.95,
            dividendYield: 0.062
          }
        },
        {
          symbol: isBrl ? 'OIBR3.SA' : 'T',
          name: isBrl ? 'Oi S.A.' : 'AT&T Inc.',
          metrics: {
            pe: 9.8,
            roe: 0.08,
            netMargin: 0.06,
            debtToEquity: 185,
            currentRatio: 0.8,
            dividendYield: 0.071
          }
        }
      ];
    } else if (sector === 'Financials') {
      return [
        {
          symbol: isBrl ? 'ITUB4.SA' : 'JPM',
          name: isBrl ? 'Itaú Unibanco S.A.' : 'JPMorgan Chase & Co.',
          metrics: {
            pe: 9.2,
            roe: 0.21,
            netMargin: 0.18,
            debtToEquity: 120,
            currentRatio: 1.25,
            dividendYield: 0.048
          }
        },
        {
          symbol: isBrl ? 'BBDC4.SA' : 'BAC',
          name: isBrl ? 'Banco Bradesco S.A.' : 'Bank of America Corp.',
          metrics: {
            pe: 8.5,
            roe: 0.13,
            netMargin: 0.11,
            debtToEquity: 130,
            currentRatio: 1.15,
            dividendYield: 0.038
          }
        },
        {
          symbol: isBrl ? 'BBAS3.SA' : 'MS',
          name: isBrl ? 'Banco do Brasil S.A.' : 'Morgan Stanley',
          metrics: {
            pe: 4.8,
            roe: 0.22,
            netMargin: 0.15,
            debtToEquity: 140,
            currentRatio: 1.2,
            dividendYield: 0.092
          }
        }
      ];
    } else if (sector === 'Utilities') {
      return [
        {
          symbol: isBrl ? 'EGIE3.SA' : 'NEE',
          name: isBrl ? 'Engie Brasil Energia S.A.' : 'NextEra Energy, Inc.',
          metrics: {
            pe: 14.8,
            roe: 0.28,
            netMargin: 0.22,
            debtToEquity: 180,
            currentRatio: 1.1,
            dividendYield: 0.068
          }
        },
        {
          symbol: isBrl ? 'CPLE6.SA' : 'DUK',
          name: isBrl ? 'Copel S.A.' : 'Duke Energy Corp.',
          metrics: {
            pe: 13.2,
            roe: 0.11,
            netMargin: 0.12,
            debtToEquity: 155,
            currentRatio: 0.85,
            dividendYield: 0.054
          }
        },
        {
          symbol: isBrl ? 'ELET3.SA' : 'SO',
          name: isBrl ? 'Eletrobras S.A.' : 'Southern Company',
          metrics: {
            pe: 18.5,
            roe: 0.08,
            netMargin: 0.09,
            debtToEquity: 145,
            currentRatio: 0.9,
            dividendYield: 0.042
          }
        }
      ];
    }

    return [
      {
        symbol: 'PEER-A',
        name: 'Peer Benchmark A',
        metrics: {
          pe: 18.5,
          roe: 0.15,
          netMargin: 0.12,
          debtToEquity: 80,
          currentRatio: 1.5,
          dividendYield: 0.02
        }
      },
      {
        symbol: 'PEER-B',
        name: 'Peer Benchmark B',
        metrics: {
          pe: 22.0,
          roe: 0.18,
          netMargin: 0.14,
          debtToEquity: 95,
          currentRatio: 1.6,
          dividendYield: 0.015
        }
      },
      {
        symbol: 'PEER-C',
        name: 'Peer Benchmark C',
        metrics: {
          pe: 15.2,
          roe: 0.11,
          netMargin: 0.09,
          debtToEquity: 110,
          currentRatio: 1.2,
          dividendYield: 0.035
        }
      }
    ];
  }

  async getAsset(symbol: string, exchange: string, range = '1mo'): Promise<NormalizedAsset> {
    let dataPart: Omit<NormalizedAsset, 'history' | 'peers'> | null = null;
    let historyPart: HistoricalPoint[] = [];
    let errorLog = '';

    try {
      const yahooProvider = this.providers[0];
      dataPart = await yahooProvider.fetchAssetData(symbol, exchange);
      try {
        historyPart = await yahooProvider.fetchAssetHistory(symbol, exchange, range);
      } catch (histError) {
        console.warn('Yahoo Finance chart failed, using fallback chart.', histError);
        const mockProvider = this.providers[1];
        historyPart = await mockProvider.fetchAssetHistory(symbol, exchange, range);
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      errorLog += `Yahoo Finance Provider failed: ${errMsg}. `;
      console.warn('YahooFinanceProvider failed. Invoking Mock fallback...', err);
    }

    if (!dataPart) {
      try {
        const mockProvider = this.providers[1];
        dataPart = await mockProvider.fetchAssetData(symbol, exchange);
        historyPart = await mockProvider.fetchAssetHistory(symbol, exchange, range);
      } catch (mockErr) {
        const mockErrMsg = mockErr instanceof Error ? mockErr.message : String(mockErr);
        errorLog += `Mock Provider failed: ${mockErrMsg}`;
        throw new Error(`All providers failed. Logs: ${errorLog}`);
      }
    }

    if (historyPart && historyPart.length > 1) {
      const first = historyPart[0];
      const last = historyPart[historyPart.length - 1];
      if (last.close !== null && first.close !== null) {
        dataPart.profile.priceChange = Number((last.close - first.close).toFixed(2));
        dataPart.profile.priceChangePercent = Number(
          ((last.close / first.close - 1) * 100).toFixed(2)
        );
      }
    }

    const peers = this.getPeersForSector(dataPart.profile.sector, dataPart.profile.currency);

    return {
      ...dataPart,
      history: historyPart,
      peers
    };
  }

  async getAssetHistory(
    symbol: string,
    exchange: string,
    range: string
  ): Promise<HistoricalPoint[]> {
    for (const provider of this.providers) {
      try {
        const history = await provider.fetchAssetHistory(symbol, exchange, range);
        if (history && history.length > 0) return history;
      } catch (err) {
        console.warn(`History fetch failed for provider: ${provider.name}`, err);
      }
    }
    return [];
  }
}
export const financialRepository = new FinancialDataRepository();
