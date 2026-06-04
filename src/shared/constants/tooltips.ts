export interface TooltipDefinition {
  title: string;
  definition: string;
  formula: string;
  interpretation: string;
  range: string;
  limitation: string;
}

export const METRIC_TOOLTIPS: Record<string, TooltipDefinition> = {
  pe: {
    title: 'P/E (Price to Earnings) Ratio',
    definition:
      'Measures how much the market is willing to pay for each dollar of current net earnings.',
    formula: 'P/E = Stock Price / Earnings Per Share (EPS)',
    interpretation:
      'A high PE implies high growth expectations, while a low PE can indicate discount value or operational deterioration.',
    range: 'Attractive: <= 15x, Normal: 15x - 25x, Premium: >= 25x (varies by sector).',
    limitation:
      'Cannot be calculated for loss-making companies and is susceptible to one-off accounting distortions.'
  },
  forwardPe: {
    title: 'Forward P/E Ratio',
    definition:
      'Compares current stock price to projected earnings per share over the next 12 months.',
    formula: 'Forward P/E = Stock Price / Projected EPS',
    interpretation:
      'Indicates valuation multiples based on consensus future growth forecasts rather than past results.',
    range: 'Attractive: <= 12x, Normal: 12x - 20x, Premium: >= 20x.',
    limitation:
      'Relies on consensus analyst projections which are frequently revised during market shifts.'
  },
  pegRatio: {
    title: 'PEG (Price/Earnings to Growth) Ratio',
    definition: 'Normalizes the P/E multiple relative to the growth rate of earnings.',
    formula: 'PEG = P/E Ratio / Annual EPS Growth Rate (%)',
    interpretation: 'Helps identify high-growth companies trading at reasonable valuations.',
    range: 'Undervalued: < 1.0, Fair value: 1.0 - 2.0, Overvalued: > 2.0.',
    limitation: 'Growth projections might be over-optimistic or fail to materialize entirely.'
  },
  evToEbitda: {
    title: 'EV/EBITDA Multiple',
    definition:
      'Compares the enterprise value (market cap + debt - cash) with its operating cash generation before interest, tax, depreciation, and amortization.',
    formula: 'EV/EBITDA = Enterprise Value / EBITDA',
    interpretation: 'Used to value capital-intensive businesses independent of capital structure.',
    range: 'Attractive: < 8x, Normal: 8x - 15x, Premium: > 15x.',
    limitation:
      'Ignores capital expenditures (CAPEX), which are vital to sustain production in asset-heavy industries.'
  },
  evToEbit: {
    title: 'EV/EBIT Multiple',
    definition:
      'Compares enterprise value to operating profit (EBIT), accounting for depreciation and amortization expenses.',
    formula: 'EV/EBIT = Enterprise Value / Operating Profit (EBIT)',
    interpretation:
      'More accurate than EV/EBITDA for companies where asset depreciation represents a real economic cost.',
    range: 'Attractive: < 10x, Normal: 10x - 18x, Premium: > 18x.',
    limitation: 'Does not capture interest expense stress on highly leveraged capital structures.'
  },
  priceToSales: {
    title: 'Price to Sales (P/S) Ratio',
    definition: 'Valuation multiple comparing market cap to total sales revenue.',
    formula: 'P/S = Market Capitalization / Total Annual Revenue',
    interpretation: 'Useful for valuing early-stage or cyclical companies with volatile earnings.',
    range: 'Attractive: < 1.5x, Normal: 1.5x - 4.0x, Premium: > 4.0x.',
    limitation:
      'Compares price to sales but ignores operating costs and eventual lack of profit margins.'
  },
  priceToBook: {
    title: 'Price to Book (P/B) Ratio',
    definition: 'Compares market valuation to net asset book value.',
    formula: 'P/B = Stock Price / Book Value Per Share (BVPS)',
    interpretation: 'Indicates value in asset-heavy sectors like banking and real estate.',
    range: 'Attractive: < 1.5x, Normal: 1.5x - 4.0x, Premium: > 4.0x.',
    limitation: 'Fails to capture the value of intangible assets like IP, software, or brand value.'
  },
  roe: {
    title: 'Return on Equity (ROE)',
    definition: 'Measures how efficiently a company generates profits using shareholder capital.',
    formula: 'ROE = Net Income / Shareholders Equity',
    interpretation: 'Higher is better. Demonstrates profitability relative to owner reinvestments.',
    range: 'Excellent: >= 20%, Good: 12% - 20%, Sub-optimal: < 10%.',
    limitation:
      'Can be artificially inflated by excessive leverage (high debt reduces equity base).'
  },
  roa: {
    title: 'Return on Assets (ROA)',
    definition:
      'Indicates how efficiently a company generates net income from its total asset base.',
    formula: 'ROA = Net Income / Total Assets',
    interpretation: 'Evaluates capital efficiency, including both debt and equity-funded assets.',
    range: 'Excellent: >= 8%, Good: 4% - 8%, Sub-optimal: < 2%.',
    limitation: 'Varies dramatically across capital-intensive vs asset-light industries.'
  },
  roic: {
    title: 'Return on Invested Capital (ROIC)',
    definition: 'Measures return generated on all debt and equity capital deployed in operations.',
    formula: 'ROIC = NOPAT / (Total Debt + Equity - Cash)',
    interpretation:
      'Excellent metric of capital allocation discipline and durable competitive advantages (moat).',
    range: 'Wide Moat: > 15%, Narrow Moat: 10% - 15%, No Moat: < 10%.',
    limitation:
      'Requires adjustment of capitalized leases and research expenses to reflect true invested capital.'
  },
  croic: {
    title: 'Cash Return on Invested Capital (CROIC)',
    definition:
      'Calculates cash returns generated relative to deployed capital, avoiding accrual accounting adjustments.',
    formula: 'CROIC = Free Cash Flow / Invested Capital',
    interpretation:
      'True cash-on-cash metric that verifies if accounting ROIC is backed by physical cash creation.',
    range: 'Excellent: > 15%, Good: 8% - 15%, Sub-optimal: < 5%.',
    limitation: 'Subject to annual volatility due to the timing of capital expenditure cycles.'
  },
  grossMargin: {
    title: 'Gross Profit Margin',
    definition: 'Indicates the percentage of revenue remaining after covering cost of goods sold.',
    formula: 'Gross Margin = (Revenue - COGS) / Revenue',
    interpretation: 'Reflects core pricing power and raw competitive manufacturing efficiency.',
    range: 'Excellent: > 50%, Normal: 30% - 50%, High Competition: < 20%.',
    limitation: 'Does not account for corporate overheads, research costs, or sales commissions.'
  },
  operatingMargin: {
    title: 'Operating Profit Margin',
    definition:
      'Percentage of sales revenue remaining after paying for operating overheads (SG&A, R&D).',
    formula: 'Operating Margin = Operating Income (EBIT) / Revenue',
    interpretation: 'Key metric of operational leverage and overhead management.',
    range: 'Excellent: > 20%, Normal: 10% - 20%, Weak: < 5%.',
    limitation:
      'Susceptible to restructurings, legal settlements, and non-operational accounting events.'
  },
  netMargin: {
    title: 'Net Profit Margin',
    definition:
      'Percentage of revenue translating to net earnings for shareholders after all expenses and taxes.',
    formula: 'Net Margin = Net Income / Revenue',
    interpretation: 'The bottom-line profitability index.',
    range: 'Excellent: > 15%, Normal: 8% - 15%, Weak: < 3%.',
    limitation:
      'Can be heavily distorted by tax credits, currency hedges, and financial expense cycles.'
  },
  debtToEquity: {
    title: 'Debt to Equity Ratio',
    definition: 'Compares total interest-bearing debt to shareholders book equity.',
    formula: 'Debt/Equity = Total Debt / Shareholders Equity * 100',
    interpretation: 'Measures financial leverage and capital structuring safety.',
    range: 'Conservative: < 50%, Standard: 50% - 120%, Aggressive: > 150%.',
    limitation:
      'Varies widely; capital-intensive utilities safely carry high ratios, tech companies typically avoid it.'
  },
  netDebtToEbitda: {
    title: 'Net Debt / EBITDA Ratio',
    definition: 'Measures leverage in years of EBITDA needed to repay net interest-bearing debt.',
    formula: 'Net Debt/EBITDA = (Total Debt - Cash) / EBITDA',
    interpretation:
      'Primary metric used by credit agencies to evaluate default risks and debt capacity.',
    range: 'Safe: < 1.5x, Moderate: 1.5x - 3.0x, High Risk: > 3.0x.',
    limitation: 'Fails to account for actual cash interest rates and principal maturity schedules.'
  },
  interestCoverage: {
    title: 'Interest Coverage Ratio',
    definition: 'Measures capability to pay interest expenses using operating earnings.',
    formula: 'Interest Coverage = EBIT / Interest Expense',
    interpretation:
      'A higher coverage ratio indicates a wider margin of safety against debt servicing defaults.',
    range: 'Safe: > 5x, Healthy: 3x - 5x, High Risk: < 1.5x.',
    limitation:
      'EBIT is an accrual metric, so cash flow coverage might be lower if receivables accumulate.'
  },
  currentRatio: {
    title: 'Current Ratio',
    definition: 'Measures capability to cover short-term liabilities with short-term assets.',
    formula: 'Current Ratio = Current Assets / Current Liabilities',
    interpretation: 'Indicates near-term working capital solvency.',
    range: 'Optimal: 1.5 - 2.5, Tight: 1.0 - 1.5, High Risk: < 1.0.',
    limitation: 'Includes illiquid items like slow-moving inventory or doubtful receivables.'
  },
  quickRatio: {
    title: 'Quick Ratio (Acid-Test)',
    definition: 'Measures short-term liquidity excluding inventory assets.',
    formula: 'Quick Ratio = (Cash + Cash Equiv. + Receivables) / Current Liabilities',
    interpretation: 'More conservative solvency test than Current Ratio.',
    range: 'Safe: >= 1.0, Conservative: > 1.2, High Risk: < 0.8.',
    limitation: 'Can be volatile if trade receivables collection cycles lengthen.'
  },
  fcfYield: {
    title: 'Free Cash Flow (FCF) Yield',
    definition:
      'Measures return generated in free cash relative to total enterprise value or market capitalization.',
    formula: 'FCF Yield = Free Cash Flow / Market Capitalization',
    interpretation: 'Indicates how cheap/expensive a stock is based on its cash generating output.',
    range: 'Very Cheap: > 8%, Attractive: 5% - 8%, Expensive: < 3%.',
    limitation:
      'Firms in heavy investment phases will exhibit low yields, despite high business quality.'
  },
  cashConversion: {
    title: 'Cash Conversion Ratio',
    definition:
      'Measures percentage of operating cash flow converted into free cash flow after capital expenditures.',
    formula: 'Cash Conversion = Free Cash Flow / Operating Cash Flow',
    interpretation: 'Demonstrates the capital intensity of the business model.',
    range: 'Excellent: > 75%, Good: 50% - 75%, Asset Intensive: < 40%.',
    limitation: 'Subject to wide annual swings during periods of major capacity additions.'
  },
  dividendYield: {
    title: 'Dividend Yield',
    definition: 'Annual dividend payout relative to current stock price.',
    formula: 'Dividend Yield = Annual Dividend Per Share / Stock Price',
    interpretation: 'Direct cash yield on owner investment.',
    range: 'High: > 6%, Balanced: 2% - 6%, Low/Growth: < 2%.',
    limitation:
      'A high yield can be a trap (value trap) if earnings are contracting and the dividend is cut.'
  },
  payoutRatio: {
    title: 'Dividend Payout Ratio',
    definition: 'Percentage of net profits distributed as dividends to shareholders.',
    formula: 'Payout Ratio = Dividends / Net Income',
    interpretation: 'Measures safety and room for dividend growth.',
    range: 'Safe: < 60%, Aggressive/Income: 60% - 90%, Unstable: > 90%.',
    limitation: 'Fails to reflect capital expenditure buffers needed to support operational scale.'
  }
};

/** Line-item glossary for the multi-year annual statement tables. */
export const STATEMENT_TOOLTIPS = {
  revenue: {
    title: 'Revenue (Topline)',
    definition: 'Total sales generated by the company before any deductions.',
    formula: 'Total Cash & Credit Inflow from Sales',
    interpretation: 'Look for consistent growth year-over-year. Declines indicate contraction.',
    range: 'Continuous growing CAGR is attractive.',
    limitation: "Doesn't reflect profitability or cash conversion."
  },
  grossProfit: {
    title: 'Gross Profit',
    definition: 'Revenue minus cost of goods sold (COGS).',
    formula: 'Gross Profit = Revenue - COGS',
    interpretation: 'Shows core production profit.',
    range: 'High and stable is attractive.',
    limitation: 'Ignores administrative, marketing, and interest expenses.'
  },
  ebitda: {
    title: 'EBITDA',
    definition: 'Earnings before interest, taxes, depreciation, and amortization.',
    formula: 'EBITDA = EBIT + Depreciation + Amortization',
    interpretation: 'Proxy for operational cash flow generation before financing costs.',
    range: 'Should expand in proportion to revenue growth.',
    limitation: 'Ignores heavy asset investments or capital costs.'
  },
  ebit: {
    title: 'Operating Profit (EBIT)',
    definition: 'Earnings before interest and taxes. Profit from core business operations.',
    formula: 'EBIT = Gross Profit - Operating Expenses (SG&A, R&D)',
    interpretation: 'Demonstrates operational leverage efficiency.',
    range: 'Look for stable and growing margins over time.',
    limitation: "Doesn't account for tax burdens or interest payment pressure."
  },
  netIncome: {
    title: 'Net Income (Bottomline)',
    definition: 'Consolidated profit for shareholders after all expenses, tax, and interest.',
    formula: 'Net Income = Operating Income - Interest - Tax - Non-Operating',
    interpretation: 'The final earnings metric used to calculate EPS and dividends.',
    range: 'Look for positive, growing net income.',
    limitation: 'Susceptible to accounting write-downs and one-off non-cash items.'
  },
  cash: {
    title: 'Cash & Equivalents',
    definition: 'Highly liquid cash assets held on the balance sheet.',
    formula: 'Cash + Short-term marketable securities',
    interpretation: 'Provides safety buffer and capital allocation flexibility.',
    range: 'Higher cash allows defensive security.',
    limitation: 'Cash generates low returns compared to operating assets.'
  },
  debt: {
    title: 'Total Debt',
    definition: 'Total interest-bearing liabilities, short and long term.',
    formula: 'Short-term Debt + Long-term Debt',
    interpretation: 'Indicates leveraged capital liabilities.',
    range: 'Look for reasonable levels relative to equity.',
    limitation: 'Does not capture off-balance sheet liabilities or leases.'
  },
  equity: {
    title: 'Shareholders Equity',
    definition: 'Total asset value net of liabilities; book value belonging to owners.',
    formula: 'Total Assets - Total Liabilities',
    interpretation: 'Represents internal net worth backing common equity.',
    range: 'Consistent growth denotes compounder characteristics.',
    limitation: 'Accounting book value differs from market valuation.'
  },
  workingCapital: {
    title: 'Net Working Capital',
    definition: 'Operating liquidity available to fund day-to-day cycles.',
    formula: 'Working Capital = Current Assets - Current Liabilities',
    interpretation: 'Positive working capital implies short-term operational health.',
    range: 'Should keep pace with operational scale expansion.',
    limitation: 'Negative value may signal liquidity constraints.'
  },
  operatingCashFlow: {
    title: 'Operating Cash Flow (OCF)',
    definition: 'Physical cash inflow from core business transactions.',
    formula: 'Net Income + Non-Cash Adjustments - Working Capital changes',
    interpretation: 'Shows true cash generating power before investments.',
    range: 'Should exceed net income (high cash conversion).',
    limitation: 'Includes working capital changes which can be volatile.'
  },
  capex: {
    title: 'Capital Expenditures (CAPEX)',
    definition:
      'Cash outflows used to acquire or upgrade physical property, plants, and equipment.',
    formula: 'Outflows for PPE purchase',
    interpretation: 'Indicates reinvestment intensity needed to sustain scale.',
    range: 'Low CAPEX relative to OCF yields high FCF.',
    limitation: 'High capital intensity dilutes free cash flows.'
  },
  freeCashFlow: {
    title: 'Free Cash Flow (FCF)',
    definition: 'Disposable cash generated after capital investments to sustain operations.',
    formula: 'FCF = Operating Cash Flow - CAPEX',
    interpretation: 'Cash available for dividends, buybacks, M&A, or deleveraging.',
    range: 'The ultimate metric of business value. Higher is better.',
    limitation: 'Can be temporarily negative during major growth investment spikes.'
  },
  buybacks: {
    title: 'Share Repurchases',
    definition: 'Cash spent buying back own common equity from the market.',
    formula: 'Outflows for share buyback',
    interpretation: 'Reduces share count, increasing EPS for remaining owners.',
    range: 'Value accretive when executed below intrinsic value.',
    limitation: 'Destroys value if executed at premium valuations.'
  },
  dividends: {
    title: 'Dividends Paid',
    definition: 'Direct cash return sent to shareholders.',
    formula: 'Total distributed cash dividends',
    interpretation: 'Look for consistency and sustainable coverage ratio.',
    range: 'Should be fully funded by Free Cash Flow, not debt.',
    limitation: 'Reduces cash reserves available for growth reinvestments.'
  }
} as const satisfies Record<string, TooltipDefinition>;
