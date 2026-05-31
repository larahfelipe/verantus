import { SECTOR_BENCHMARKS, DEFAULT_BENCHMARK } from '../constants/benchmarks';
import type { AssetMetrics, AssetProfile, AssetScores, ScoreComponent } from '../types/domain';

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export function computeQuantitativeScores(
  metrics: AssetMetrics,
  profile: AssetProfile
): AssetScores {
  const sector = profile.sector;
  const benchmark = SECTOR_BENCHMARKS[sector] || DEFAULT_BENCHMARK;

  // 1. BUSINESS QUALITY SCORE
  const bqDetails: string[] = [];
  let bqPoints = 50; // start at neutral mid-point

  const roe = metrics.profitability.roe;
  const roa = metrics.profitability.roa;
  const grossMargin = metrics.profitability.grossMargin;
  const operatingMargin = metrics.profitability.operatingMargin;
  const netMargin = metrics.profitability.netMargin;

  if (roe !== null) {
    const diff = roe - benchmark.roe;
    if (roe >= 0.2) {
      bqPoints += 15;
      bqDetails.push(
        `Excellent Return on Equity (ROE: ${(roe * 100).toFixed(1)}%) exceeds high benchmark 20.0%.`
      );
    } else if (diff > 0) {
      bqPoints += 8;
      bqDetails.push(
        `Superior ROE (${(roe * 100).toFixed(1)}%) is above the sector benchmark of ${(benchmark.roe * 100).toFixed(1)}%.`
      );
    } else if (roe < 0) {
      bqPoints -= 20;
      bqDetails.push(`Negative ROE (${(roe * 100).toFixed(1)}%) indicates capital destruction.`);
    } else {
      bqPoints -= 5;
      bqDetails.push(
        `Sub-par ROE (${(roe * 100).toFixed(1)}%) is lower than sector average of ${(benchmark.roe * 100).toFixed(1)}%.`
      );
    }
  } else {
    bqDetails.push('ROE metric is unavailable.');
  }

  if (roa !== null) {
    if (roa >= 0.08) {
      bqPoints += 10;
      bqDetails.push(
        `Strong ROA (${(roa * 100).toFixed(1)}%) indicates highly efficient asset utilization.`
      );
    } else if (roa < 0) {
      bqPoints -= 10;
      bqDetails.push(
        `Negative ROA (${(roa * 100).toFixed(1)}%) indicates losses generated relative to assets.`
      );
    }
  }

  if (grossMargin !== null) {
    if (grossMargin >= 0.5) {
      bqPoints += 10;
      bqDetails.push(
        `High pricing power shown by Gross Margin of ${(grossMargin * 100).toFixed(1)}%.`
      );
    } else if (grossMargin < 0.2) {
      bqPoints -= 10;
      bqDetails.push(
        `Low Gross Margin (${(grossMargin * 100).toFixed(1)}%) suggests intense competition or high input costs.`
      );
    }
  }

  if (operatingMargin !== null) {
    const diff = operatingMargin - benchmark.operatingMargin;
    if (diff > 0.05) {
      bqPoints += 10;
      bqDetails.push(
        `Operating Margin of ${(operatingMargin * 100).toFixed(1)}% is significantly above sector average.`
      );
    } else if (operatingMargin < 0.05) {
      bqPoints -= 15;
      bqDetails.push(`Extremely thin Operating Margin of ${(operatingMargin * 100).toFixed(1)}%.`);
    }
  }

  if (netMargin !== null && netMargin >= 0.15) {
    bqPoints += 5;
    bqDetails.push(`Healthy Net Profit Margin of ${(netMargin * 100).toFixed(1)}%.`);
  }

  const businessQuality: ScoreComponent = {
    score: clamp(bqPoints, 0, 100),
    methodology:
      'Evaluates profitability ratios (ROE, ROA, margins) against sector benchmarks and absolute hurdles.',
    details: bqDetails
  };

  // 2. GROWTH SCORE
  const gDetails: string[] = [];
  let gPoints = 50;

  const revGrowth = metrics.growth.quarterlyRevenueGrowth;
  const earnGrowth = metrics.growth.quarterlyEarningsGrowth;

  if (revGrowth !== null) {
    if (revGrowth >= benchmark.revenueGrowth + 0.05) {
      gPoints += 20;
      gDetails.push(
        `Outstanding Revenue Growth (${(revGrowth * 100).toFixed(1)}% YoY) is outperforming sector benchmark of ${(benchmark.revenueGrowth * 100).toFixed(1)}%.`
      );
    } else if (revGrowth >= benchmark.revenueGrowth) {
      gPoints += 10;
      gDetails.push(
        `Solid Revenue Growth (${(revGrowth * 100).toFixed(1)}% YoY) matches or exceeds sector benchmark.`
      );
    } else if (revGrowth <= -0.05) {
      gPoints -= 25;
      gDetails.push(
        `Revenue contraction detected (${(revGrowth * 100).toFixed(1)}% YoY), indicating declining demand.`
      );
    } else {
      gPoints -= 5;
      gDetails.push(
        `Revenue Growth (${(revGrowth * 100).toFixed(1)}%) lags sector benchmark of ${(benchmark.revenueGrowth * 100).toFixed(1)}%.`
      );
    }
  } else {
    gDetails.push('Revenue growth data unavailable.');
  }

  if (earnGrowth !== null) {
    if (earnGrowth >= 0.15) {
      gPoints += 15;
      gDetails.push(`High-velocity Earnings Growth (${(earnGrowth * 100).toFixed(1)}% YoY).`);
    } else if (earnGrowth >= 0.05) {
      gPoints += 8;
      gDetails.push(`Moderate Earnings Growth (${(earnGrowth * 100).toFixed(1)}% YoY).`);
    } else if (earnGrowth <= -0.1) {
      gPoints -= 20;
      gDetails.push(`Severe earnings deterioration (${(earnGrowth * 100).toFixed(1)}% YoY).`);
    }
  } else {
    gDetails.push('Earnings growth data unavailable.');
  }

  const growth: ScoreComponent = {
    score: clamp(gPoints, 0, 100),
    methodology:
      'Evaluates year-over-year revenue and earnings expansion relative to industry historical standards.',
    details: gDetails
  };

  // 3. FINANCIAL HEALTH / LEVERAGE SCORE
  const fhDetails: string[] = [];
  let fhPoints = 50;

  const de = metrics.leverage.debtToEquity;
  const cr = metrics.leverage.currentRatio;
  const qr = metrics.leverage.quickRatio;
  const fcf = metrics.cashFlow.freeCashFlow;

  if (de !== null) {
    // de in percent (e.g. 100 = 100%)
    if (de <= benchmark.debtToEquity * 0.75) {
      fhPoints += 15;
      fhDetails.push(
        `Low leverage: Debt/Equity ratio (${de.toFixed(1)}%) is well below industry standard of ${benchmark.debtToEquity.toFixed(1)}%.`
      );
    } else if (de > benchmark.debtToEquity * 1.5) {
      fhPoints -= 25;
      fhDetails.push(
        `Elevated debt level: Debt/Equity ratio (${de.toFixed(1)}%) significantly exceeds sector standard of ${benchmark.debtToEquity.toFixed(1)}%.`
      );
    } else {
      fhDetails.push(
        `Standard leverage: Debt/Equity ratio (${de.toFixed(1)}%) is inline with industry.`
      );
    }
  }

  if (cr !== null) {
    if (cr >= 1.5) {
      fhPoints += 15;
      fhDetails.push(
        `Excellent short-term liquidity: Current Ratio is at ${cr.toFixed(2)} (recommended >= 1.5).`
      );
    } else if (cr < 1.0) {
      fhPoints -= 25;
      fhDetails.push(
        `Liquidity risk: Current Ratio of ${cr.toFixed(2)} indicates current liabilities exceed current assets.`
      );
    } else {
      fhPoints += 5;
      fhDetails.push(`Acceptable short-term liquidity: Current Ratio is ${cr.toFixed(2)}.`);
    }
  }

  if (qr !== null && qr >= 1.0) {
    fhPoints += 10;
    fhDetails.push(`Solid quick ratio of ${qr.toFixed(2)} (cash & receivables cover liabilities).`);
  }

  if (fcf !== null) {
    if (fcf > 0) {
      fhPoints += 10;
      fhDetails.push(
        'Free cash flow positive, providing a protective buffer for debt service and dividend payouts.'
      );
    } else {
      fhPoints -= 15;
      fhDetails.push(
        'Free cash flow is negative, indicating cash burn which increases insolvency risks.'
      );
    }
  }

  const financialHealth: ScoreComponent = {
    score: clamp(fhPoints, 0, 100),
    methodology:
      'Measures structural leverage (Debt/Equity) and short-term solvency/liquidity ratios (Current/Quick ratios).',
    details: fhDetails
  };

  // 4. VALUATION SCORE
  const vDetails: string[] = [];
  let vPoints = 50;

  const pe = metrics.valuation.pe;
  const fpe = metrics.valuation.forwardPe;
  const peg = metrics.valuation.pegRatio;
  const pb = metrics.valuation.priceToBook;

  const currentPe = fpe || pe;

  if (currentPe !== null && currentPe > 0) {
    if (currentPe <= benchmark.forwardPE * 0.7) {
      vPoints += 25;
      vDetails.push(
        `Significant discount: PE ratio (${currentPe.toFixed(1)}) is at a >30% discount compared to sector benchmark of ${benchmark.forwardPE}.`
      );
    } else if (currentPe <= benchmark.forwardPE * 1.0) {
      vPoints += 15;
      vDetails.push(
        `Fair value: PE ratio (${currentPe.toFixed(1)}) is lower than or equal to sector benchmark.`
      );
    } else if (currentPe >= benchmark.forwardPE * 1.4) {
      vPoints -= 25;
      vDetails.push(
        `Premium pricing: PE ratio (${currentPe.toFixed(1)}) stands at a heavy premium versus sector benchmark of ${benchmark.forwardPE}.`
      );
    } else {
      vPoints -= 5;
      vDetails.push(
        `Slight premium: PE ratio (${currentPe.toFixed(1)}) is slightly above sector average.`
      );
    }
  } else {
    vPoints -= 10;
    vDetails.push(
      'PE ratio is negative or unavailable, suggesting zero/negative earnings or data gaps.'
    );
  }

  if (peg !== null) {
    if (peg > 0 && peg <= 1.2) {
      vPoints += 15;
      vDetails.push(
        `Highly attractive growth pricing: PEG ratio of ${peg.toFixed(2)} suggests stock is undervalued relative to growth rate.`
      );
    } else if (peg >= 2.5) {
      vPoints -= 15;
      vDetails.push(`Expensive growth pricing: PEG ratio is elevated at ${peg.toFixed(2)}.`);
    }
  }

  if (pb !== null) {
    if (pb <= 2.0) {
      vPoints += 5;
      vDetails.push(`Low price-to-book multiple of ${pb.toFixed(1)}.`);
    } else if (pb >= 7.0) {
      vPoints -= 10;
      vDetails.push(`Premium book value pricing: Price-to-Book is high at ${pb.toFixed(1)}.`);
    }
  }

  const valuation: ScoreComponent = {
    score: clamp(vPoints, 0, 100),
    methodology:
      'Compares price-to-earnings, PEG, and book multiples to historical sector-specific benchmark valuations.',
    details: vDetails
  };

  // 5. OPERATIONAL EFFICIENCY SCORE
  const eDetails: string[] = [];
  let ePoints = 50;

  const operatingMarginEff = metrics.profitability.operatingMargin;
  const grossMarginEff = metrics.profitability.grossMargin;
  const cashConversion = metrics.cashFlow.cashConversionRatio;

  if (operatingMarginEff !== null) {
    const ratioToBenchmark = operatingMarginEff / benchmark.operatingMargin;
    if (ratioToBenchmark >= 1.25) {
      ePoints += 25;
      eDetails.push(
        `Exceptional operational efficiency: Operating Margin of ${(operatingMarginEff * 100).toFixed(1)}% is 25%+ above sector benchmark of ${(benchmark.operatingMargin * 100).toFixed(1)}%.`
      );
    } else if (ratioToBenchmark < 0.75) {
      ePoints -= 20;
      eDetails.push(
        `Lagging operational efficiency: Operating Margin of ${(operatingMarginEff * 100).toFixed(1)}% is substantially below sector benchmark of ${(benchmark.operatingMargin * 100).toFixed(1)}%.`
      );
    } else {
      ePoints += 5;
      eDetails.push(
        `Normal operational efficiency: Operating Margin is inline with sector standards.`
      );
    }
  }

  if (grossMarginEff !== null && operatingMarginEff !== null) {
    const conversion = operatingMarginEff / grossMarginEff;
    if (conversion >= 0.5) {
      ePoints += 15;
      eDetails.push(
        `Excellent overhead management: Retains ${(conversion * 100).toFixed(1)}% of gross profits as operating profits.`
      );
    } else if (conversion < 0.2) {
      ePoints -= 15;
      eDetails.push(
        `High SG&A overheads: Only ${(conversion * 100).toFixed(1)}% of gross profits translates into operating income.`
      );
    }
  }

  if (cashConversion !== null) {
    if (cashConversion >= 0.8) {
      ePoints += 10;
      eDetails.push(
        `Excellent cash conversion: Free Cash Flow / Operating Cash Flow is at ${(cashConversion * 100).toFixed(1)}%.`
      );
    }
  }

  const efficiency: ScoreComponent = {
    score: clamp(ePoints, 0, 100),
    methodology:
      'Analyzes operating leverage, margin maintenance, and the efficiency of converting gross profits to cash flows.',
    details: eDetails
  };

  // 6. CONSOLIDATED SCORE
  // Weighted: Business Quality (25%), Growth (20%), Financial Health (25%), Valuation (20%), Efficiency (10%)
  const consolidated = Math.round(
    businessQuality.score * 0.25 +
      growth.score * 0.2 +
      financialHealth.score * 0.25 +
      valuation.score * 0.2 +
      efficiency.score * 0.1
  );

  return {
    businessQuality,
    growth,
    financialHealth,
    valuation,
    efficiency,
    consolidated
  };
}
