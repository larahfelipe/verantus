export interface MetricValue {
  raw: number | null;
  fmt: string;
}

export interface AssetProfile {
  symbol: string;
  name: string;
  shortName: string;
  exchange: string;
  sector: string;
  industry: string;
  country: string;
  employees: number | null;
  website: string;
  businessSummary: string;
  currency: string;
  currentPrice: number | null;
  priceChange: number | null;
  priceChangePercent: number | null;
}

export interface ValuationMetrics {
  pe: number | null;
  forwardPe: number | null;
  pegRatio: number | null;
  evToEbitda: number | null;
  evToEbit: number | null;
  priceToSales: number | null;
  priceToBook: number | null;
  enterpriseValue: number | null;
  dividendYield: number | null;
}

export interface ProfitabilityMetrics {
  roe: number | null;
  roa: number | null;
  roic: number | null;
  croic: number | null;
  grossMargin: number | null;
  operatingMargin: number | null;
  netMargin: number | null;
}

export interface GrowthMetrics {
  revenueGrowth3Yr: number | null; // CAGR 3Yr
  ebitdaGrowth3Yr: number | null; // CAGR 3Yr
  netIncomeGrowth3Yr: number | null; // CAGR 3Yr
  dividendGrowth3Yr: number | null; // CAGR 3Yr
  quarterlyRevenueGrowth: number | null;
  quarterlyEarningsGrowth: number | null;
}

export interface CashFlowMetrics {
  operatingCashFlow: number | null;
  freeCashFlow: number | null;
  fcfYield: number | null;
  cashConversionRatio: number | null; // FCF / Operating Cash Flow
}

export interface LeverageMetrics {
  debtToEquity: number | null;
  netDebtToEbitda: number | null;
  interestCoverage: number | null;
  currentRatio: number | null;
  quickRatio: number | null;
  totalDebt: number | null;
  totalCash: number | null;
}

export interface DividendsMetrics {
  dividendYield: number | null;
  payoutRatio: number | null;
  dividendGrowth: string;
  lastDividend: number | null;
  exDividendDate: string;
}

export interface AssetMetrics {
  valuation: ValuationMetrics;
  profitability: ProfitabilityMetrics;
  growth: GrowthMetrics;
  cashFlow: CashFlowMetrics;
  leverage: LeverageMetrics;
  dividends: DividendsMetrics;
}

export interface ScoreItemDetail {
  name: string;
  value: string;
  weight: number;
  points: number;
  maxPoints: number;
  benchmark: string;
  explanation: string;
}

export interface ScoreComponent {
  score: number; // 0 - 100
  methodology: string;
  breakdown?: ScoreItemDetail[];
  details: string[];
}

export interface AssetScores {
  businessQuality: ScoreComponent;
  growth: ScoreComponent;
  financialHealth: ScoreComponent;
  valuation: ScoreComponent;
  efficiency: ScoreComponent;
  consolidated: number; // Consolidated score 0 - 100
}

export interface HistoricalPoint {
  timestamp: number;
  date: string;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  volume: number | null;
}

export interface PeerBenchmark {
  symbol: string;
  name: string;
  metrics: {
    pe: number | null;
    roe: number | null;
    netMargin: number | null;
    debtToEquity: number | null;
    currentRatio: number | null;
    dividendYield: number | null;
  };
}

export interface FinancialStatementYearly {
  year: number;
  revenue: number | null;
  grossProfit: number | null;
  ebitda: number | null;
  ebit: number | null;
  netIncome: number | null;
  operatingCashFlow: number | null;
  capex: number | null;
  freeCashFlow: number | null;
  buybacks: number | null;
  dividends: number | null;
  cash: number | null;
  debt: number | null;
  equity: number | null;
  workingCapital: number | null;
  roe: number | null;
  roa: number | null;
  roic: number | null;
  croic: number | null;
}

export interface FinancialsMetricsEvolution {
  cagrRevenue: number | null;
  cagrNetIncome: number | null;
  volatilityRevenue: number | null; // Std dev
  trendRevenue: 'improving' | 'deteriorating' | 'stable';
  trendMargin: 'improving' | 'deteriorating' | 'stable';
  structuralShifts: string[];
}

export interface MoatAnalysis {
  classification: 'Wide Moat' | 'Narrow Moat' | 'No Moat';
  factors: string[];
  description: string;
}

export interface CapitalAllocationAnalysis {
  score: number;
  factors: string[];
  description: string;
}

export interface RiskFactor {
  name: string;
  score: number; // 0 - 100
  description: string;
}

export interface RiskAnalysis {
  overallScore: number;
  factors: RiskFactor[];
  description: string;
}

export interface ValuationDCFScenario {
  name: string;
  intrinsicValue: number;
  growthRate: number;
  discountRate: number;
  terminalMultiple: number;
}

export interface ReverseDCFImplied {
  impliedGrowthRate: number;
  impliedOperatingMargin: number;
  expectedReturn: number;
}

export interface ValuationFramework {
  dcfScenarios: {
    bear: ValuationDCFScenario;
    base: ValuationDCFScenario;
    bull: ValuationDCFScenario;
  };
  reverseDcf: ReverseDCFImplied;
  currentPrice: number;
}

export interface SegmentRevenue {
  name: string;
  revenueShare: number;
}

export interface CompanyResearch {
  history: string;
  businessModel: string;
  segments: SegmentRevenue[];
  keyProducts: string[];
  keyCompetitors: string[];
  regulatoryRisks: string[];
  filingsAnalysis: {
    recentGuidance: string;
    strategicChanges: string;
    marginComments: string;
    growthOutlook: string;
  };
  dataSource: string;
  dataUpdated: string;
  reliabilityTier: 'Tier 1 (SEC / Official IR)' | 'Tier 2 (Premium API)' | 'Tier 3 (Aggregator)';
}

export interface InvestmentThesis {
  bullCase: string[];
  bearCase: string[];
  baseCase: string;
  thesisSummary: string;
  moat: MoatAnalysis;
  capitalAllocation: CapitalAllocationAnalysis;
  risks: RiskAnalysis;
  valuation: ValuationFramework;
}

export interface NormalizedAsset {
  profile: AssetProfile;
  metrics: AssetMetrics;
  scores: AssetScores;
  history: HistoricalPoint[];
  peers: PeerBenchmark[];
  financialsHistory: FinancialStatementYearly[];
  evolutionStats: FinancialsMetricsEvolution;
  thesis: InvestmentThesis;
  research: CompanyResearch;
}
