export interface MetricValue {
  raw: number | null;
  fmt: string;
}

/**
 * Confidence/provenance of a given section of the asset payload.
 * - `live`         : computed directly from a real upstream provider response.
 * - `derived`      : computed by us from real inputs (transparent formula).
 */
export type DataConfidence = 'live' | 'derived';

export interface AssetProvenance {
  /** Quote, multiples and ratios (profile + metrics). */
  fundamentals: DataConfidence;
  /** 5-year income statement / balance sheet / cash flow tables. */
  financials: DataConfidence;
  /** DCF scenarios + reverse DCF model. */
  valuationModel: DataConfidence;
  /** Bull/bear case, moat, capital allocation, risk narrative. */
  thesis: DataConfidence;
  /** Company background, segments, competitors, filings analysis. */
  research: DataConfidence;
  /** Common-size income statement and margin-trend analysis. */
  incomeAnalysis: DataConfidence;
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
  change7dPercent?: number | null;
  change1mPercent?: number | null;
  change1yPercent?: number | null;
}

export interface ValuationMetrics {
  pe: number | null;
  forwardPe: number | null;
  pegRatio: number | null;
  evToEbitda: number | null;
  evToEbit: number | null;
  priceToSales: number | null;
  evToSales: number | null; // distinct from P/S (enterprise value based)
  priceToBook: number | null;
  enterpriseValue: number | null;
  marketCap: number | null;
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

export type MetricTrend = 'improving' | 'deteriorating' | 'stable';

export interface FinancialsMetricsEvolution {
  cagrRevenue: number | null;
  cagrNetIncome: number | null;
  volatilityRevenue: number | null; // Std dev
  trendRevenue: MetricTrend;
  trendMargin: MetricTrend;
}

/**
 * Net margin per year. The current data source zeroes out gross profit and EBIT,
 * so gross/operating margins are not derivable; only net margin (net income over
 * revenue) uses real reported figures.
 */
export interface IncomeStatementYearBreakdown {
  year: number;
  revenue: number | null;
  netIncome: number | null;
  netMargin: number | null;
}

export interface IncomeStatementAnalysis {
  years: IncomeStatementYearBreakdown[];
  netMarginTrend: MetricTrend;
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

export interface CompanyResearch {
  history: string;
  businessModel: string;
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
  financialsHistory: FinancialStatementYearly[];
  evolutionStats: FinancialsMetricsEvolution;
  incomeAnalysis: IncomeStatementAnalysis;
  thesis: InvestmentThesis;
  research: CompanyResearch;
  provenance: AssetProvenance;
}
