export interface SectorBenchmark {
  forwardPE: number;
  roe: number;
  debtToEquity: number;
  revenueGrowth: number;
  operatingMargin: number;
}

export const SECTOR_BENCHMARKS: Record<string, SectorBenchmark> = {
  Technology: {
    forwardPE: 28,
    roe: 0.18,
    debtToEquity: 70,
    revenueGrowth: 0.12,
    operatingMargin: 0.22
  },
  Healthcare: {
    forwardPE: 24,
    roe: 0.14,
    debtToEquity: 65,
    revenueGrowth: 0.09,
    operatingMargin: 0.18
  },
  'Consumer Cyclical': {
    forwardPE: 22,
    roe: 0.16,
    debtToEquity: 95,
    revenueGrowth: 0.08,
    operatingMargin: 0.12
  },
  'Consumer Defensive': {
    forwardPE: 20,
    roe: 0.14,
    debtToEquity: 90,
    revenueGrowth: 0.05,
    operatingMargin: 0.08
  },
  Industrials: {
    forwardPE: 21,
    roe: 0.15,
    debtToEquity: 100,
    revenueGrowth: 0.06,
    operatingMargin: 0.11
  },
  Energy: {
    forwardPE: 14,
    roe: 0.14,
    debtToEquity: 80,
    revenueGrowth: 0.04,
    operatingMargin: 0.14
  },
  Utilities: {
    forwardPE: 18,
    roe: 0.1,
    debtToEquity: 140,
    revenueGrowth: 0.03,
    operatingMargin: 0.15
  },
  Financials: {
    forwardPE: 14,
    roe: 0.11,
    debtToEquity: 140,
    revenueGrowth: 0.05,
    operatingMargin: 0.15
  },
  'Communication Services': {
    forwardPE: 20,
    roe: 0.12,
    debtToEquity: 95,
    revenueGrowth: 0.07,
    operatingMargin: 0.16
  },
  'Basic Materials': {
    forwardPE: 16,
    roe: 0.12,
    debtToEquity: 85,
    revenueGrowth: 0.05,
    operatingMargin: 0.1
  },
  'Real Estate': {
    forwardPE: 17,
    roe: 0.09,
    debtToEquity: 135,
    revenueGrowth: 0.04,
    operatingMargin: 0.35
  }
};

export const DEFAULT_BENCHMARK: SectorBenchmark = {
  forwardPE: 20,
  roe: 0.13,
  debtToEquity: 95,
  revenueGrowth: 0.06,
  operatingMargin: 0.14
};
