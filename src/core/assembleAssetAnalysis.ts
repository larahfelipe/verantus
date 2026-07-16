import type {
  AssetMetrics,
  AssetProfile,
  AssetProvenance,
  AssetScores,
  CompanyResearch,
  FinancialStatementYearly,
  IncomeStatementAnalysis,
  InvestmentThesis
} from '@/shared/types/domain';

import {
  computeValuationModel,
  deriveCapitalAllocation,
  deriveMoat,
  deriveResearch,
  deriveRisks,
  deriveThesis
} from './analysis';
import { computeIncomeStatementAnalysis } from './incomeAnalysis';
import { computeQuantitativeScores } from './scoring';

export interface AssetAnalysisInput {
  profile: AssetProfile;
  metrics: AssetMetrics;
  financialsHistory: FinancialStatementYearly[];
  currentPrice: number | null;
  freeCashFlow: number | null;
  sharesOutstanding: number | null;
  beta: number | null;
  recommendationKey: string;
}

export interface AssetAnalysis {
  scores: AssetScores;
  incomeAnalysis: IncomeStatementAnalysis;
  thesis: InvestmentThesis;
  research: CompanyResearch;
  provenance: AssetProvenance;
}

/**
 * Runs the provider-agnostic analysis pipeline over normalized inputs:
 * quantitative scores, DCF/reverse-DCF valuation and the qualitative synthesis
 * (moat, capital allocation, risk, thesis). Provenance marks the passed-in
 * fundamentals as live and everything computed here as derived.
 */
export function assembleAssetAnalysis(input: AssetAnalysisInput): AssetAnalysis {
  const { profile, metrics, financialsHistory, currentPrice, freeCashFlow } = input;

  const scores = computeQuantitativeScores(metrics, profile);

  const valuationModel = computeValuationModel(
    currentPrice,
    freeCashFlow,
    input.sharesOutstanding,
    metrics.growth.revenueGrowth3Yr ?? metrics.growth.quarterlyRevenueGrowth,
    input.beta
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
  const research = deriveResearch(profile, input.recommendationKey);
  const incomeAnalysis = computeIncomeStatementAnalysis(financialsHistory);

  return {
    scores,
    incomeAnalysis,
    thesis,
    research,
    provenance: {
      fundamentals: 'live',
      financials: 'live',
      valuationModel: 'derived',
      thesis: 'derived',
      research: 'live',
      incomeAnalysis: 'derived'
    }
  };
}
