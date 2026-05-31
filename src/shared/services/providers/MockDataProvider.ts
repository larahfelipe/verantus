import type {
  NormalizedAsset,
  HistoricalPoint,
  AssetProfile,
  AssetMetrics
} from '../../types/domain';
import { computeQuantitativeScores } from '../../utils/scoring';
import type { IFinancialDataProvider } from './IFinancialDataProvider';

export class MockDataProvider implements IFinancialDataProvider {
  public name = 'Mock Intelligence Provider';

  private generateMockChart(basePrice: number, pointsCount = 30): HistoricalPoint[] {
    const points: HistoricalPoint[] = [];
    let price = basePrice;
    const now = Date.now() / 1000;
    const secondsInDay = 86400;

    for (let i = pointsCount; i >= 0; i--) {
      const ts = now - i * secondsInDay;
      const change = (Math.random() - 0.49) * (price * 0.03); // slight upward bias
      price = price + change;
      const dateObj = new Date(ts * 1000);

      points.push({
        timestamp: ts,
        date: dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        open: Number((price * (1 - 0.01 * Math.random())).toFixed(2)),
        high: Number((price * (1 + 0.015 * Math.random())).toFixed(2)),
        low: Number((price * (1 - 0.015 * Math.random())).toFixed(2)),
        close: Number(price.toFixed(2)),
        volume: Math.round(1000000 + Math.random() * 5000000)
      });
    }
    return points;
  }

  async fetchAssetData(
    symbol: string,
    exchange: string
  ): Promise<
    Omit<
      NormalizedAsset,
      'history' | 'peers' | 'financialsHistory' | 'evolutionStats' | 'thesis' | 'research'
    >
  > {
    const cleanSym = symbol.toUpperCase();
    const isSa = exchange === '.SA' || cleanSym.endsWith('4') || cleanSym.endsWith('3');

    let companyName = `${cleanSym} Corp`;
    let sector = 'Technology';
    let industry = 'Software - Infrastructure';
    let price = 180.0;
    let employees = 150000;
    let website = `https://www.${cleanSym.toLowerCase()}.com`;
    let currency = 'USD';
    let summary = `This is a high-fidelity mock representation of ${cleanSym} fundamental metrics. The asset has strong competitive positioning, global reach, and a diversified revenue base.`;

    if (cleanSym === 'AAPL' || cleanSym === 'APPLE') {
      companyName = 'Apple Inc.';
      sector = 'Technology';
      industry = 'Consumer Electronics';
      price = 189.84;
      employees = 164000;
      website = 'https://www.apple.com';
      summary =
        'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company also sells various related services.';
    } else if (cleanSym === 'MSFT' || cleanSym === 'MICROSOFT') {
      companyName = 'Microsoft Corporation';
      sector = 'Technology';
      industry = 'Software - Infrastructure';
      price = 415.5;
      employees = 220000;
      website = 'https://www.microsoft.com';
      summary =
        'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide. Its Productivity and Business Processes segment includes Office, Exchange, SharePoint, Microsoft Teams, and LinkedIn.';
    } else if (cleanSym === 'PETR4' || cleanSym === 'PETR3') {
      companyName = 'Petróleo Brasileiro S.A. - Petrobras';
      sector = 'Energy';
      industry = 'Oil & Gas Integrated';
      price = 38.5;
      currency = 'BRL';
      employees = 45000;
      website = 'https://www.petrobras.com.br';
      summary =
        'Petróleo Brasileiro S.A. - Petrobras explores, produces, and sells oil and gas in Brazil and internationally. The company operates through Exploration and Production; Refining, Transportation and Marketing; and Gas and Power segments.';
    } else if (cleanSym === 'VALE3') {
      companyName = 'Vale S.A.';
      sector = 'Basic Materials';
      industry = 'Other Industrial Metals & Mining';
      price = 62.1;
      currency = 'BRL';
      employees = 64000;
      website = 'https://www.vale.com';
      summary =
        'Vale S.A., together with its subsidiaries, produces and sells iron ore and iron ore pellets for use as raw materials in steelmaking in Brazil and internationally. It operates through Iron Solutions and Energy Transition Materials segments.';
    }

    const profile: AssetProfile = {
      symbol: cleanSym + exchange,
      name: companyName,
      shortName: companyName,
      exchange: isSa ? 'SAO' : 'NMS',
      sector,
      industry,
      country: isSa ? 'Brazil' : 'United States',
      employees,
      website,
      businessSummary: summary,
      currency,
      currentPrice: price,
      priceChange: 2.5,
      priceChangePercent: 1.45
    };

    let pe = 25.0;
    let forwardPe = 22.0;
    let pegRatio = 1.8;
    let evToEbitda = 16.5;
    let priceToBook = 8.5;
    let roe = 0.28;
    let roa = 0.12;
    let grossMargin = 0.58;
    let operatingMargin = 0.25;
    let netMargin = 0.2;
    let debtToEquity = 75.0;
    let currentRatio = 1.8;
    let quickRatio = 1.4;
    const totalDebt = 10000000000;
    const totalCash = 15000000000;
    let dividendYield = 0.015;
    let payoutRatio = 0.35;
    const freeCashFlow = 8000000000;
    const operatingCashFlow = 10000000000;

    if (sector === 'Energy') {
      pe = 8.2;
      forwardPe = 7.5;
      pegRatio = 0.9;
      evToEbitda = 4.8;
      priceToBook = 1.3;
      roe = 0.22;
      roa = 0.09;
      grossMargin = 0.42;
      operatingMargin = 0.18;
      netMargin = 0.14;
      debtToEquity = 60.0;
      currentRatio = 1.2;
      quickRatio = 0.9;
      dividendYield = 0.085;
      payoutRatio = 0.55;
    } else if (sector === 'Basic Materials') {
      pe = 11.5;
      forwardPe = 10.2;
      pegRatio = 1.1;
      evToEbitda = 6.2;
      priceToBook = 1.8;
      roe = 0.15;
      roa = 0.07;
      grossMargin = 0.38;
      operatingMargin = 0.14;
      netMargin = 0.1;
      debtToEquity = 55.0;
      currentRatio = 1.4;
      quickRatio = 1.0;
      dividendYield = 0.062;
      payoutRatio = 0.5;
    }

    const metrics: AssetMetrics = {
      valuation: {
        pe,
        forwardPe,
        pegRatio,
        evToEbitda,
        evToEbit: evToEbitda * 1.15,
        priceToSales: pe * netMargin,
        priceToBook,
        enterpriseValue: price * 100000000,
        dividendYield
      },
      profitability: {
        roe,
        roa,
        roic: roe * 0.88,
        croic: roe * 0.82,
        grossMargin,
        operatingMargin,
        netMargin
      },
      growth: {
        revenueGrowth3Yr: 0.115,
        ebitdaGrowth3Yr: 0.142,
        netIncomeGrowth3Yr: 0.151,
        dividendGrowth3Yr: 0.085,
        quarterlyRevenueGrowth: 0.105,
        quarterlyEarningsGrowth: 0.124
      },
      cashFlow: {
        operatingCashFlow,
        freeCashFlow,
        fcfYield: freeCashFlow / (price * 100000000),
        cashConversionRatio: freeCashFlow / operatingCashFlow
      },
      leverage: {
        debtToEquity,
        netDebtToEbitda: (totalDebt - totalCash) / (operatingCashFlow * 1.2),
        interestCoverage: 12.5,
        currentRatio,
        quickRatio,
        totalDebt,
        totalCash
      },
      dividends: {
        dividendYield,
        payoutRatio,
        dividendGrowth: 'Supported',
        lastDividend: (price * dividendYield) / 4,
        exDividendDate: 'May 12, 2026'
      }
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
    _exchange: string,
    range: string
  ): Promise<HistoricalPoint[]> {
    const cleanSym = symbol.toUpperCase();
    let basePrice = 100;
    if (cleanSym === 'AAPL') basePrice = 189;
    if (cleanSym === 'MSFT') basePrice = 415;
    if (cleanSym === 'PETR4') basePrice = 38;
    if (cleanSym === 'VALE3') basePrice = 62;

    let points = 30;
    if (range === '1d') points = 10;
    if (range === '5d') points = 25;
    if (range === '1mo') points = 30;
    if (range === '6mo') points = 120;
    if (range === '1y') points = 250;
    if (range === '5y') points = 500;

    return this.generateMockChart(basePrice, points);
  }
}
