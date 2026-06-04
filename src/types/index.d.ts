import type { PropType } from 'vue';

export type StockPayload = {
  symbol: string;
  exchange: string;
  modules?: string;
  range?: string;
};

export type StockDataDestructured = StockData['quoteSummary']['result'][0];

export type StockChartDestructured = StockChart['chart']['result'][0];

export type Stock = {
  data: StockDataDestructured;
  chart: StockChartDestructured;
};

type ComponentProps<T = unknown> = {
  type: PropType<T>;
  required: boolean;
  default?: T | (() => T);
};

export type InputFieldProps = {
  type: ComponentProps<string>;
  placeholder: ComponentProps<string>;
  disabled: ComponentProps<boolean>;
  error: ComponentProps<string>;
};

export type SelectOption = {
  label: string;
  value: string;
};

export type SelectInputProps = {
  options: ComponentProps<SelectOption[]>;
  disabled: ComponentProps<boolean>;
};

export type ButtonType = 'submit' | 'button' | 'reset';

export type ButtonProps = {
  type: ComponentProps<ButtonType>;
  disabled: ComponentProps<boolean>;
};

export type ToggleInputProps = {
  value: ComponentProps<boolean>;
  uncheckedIcon: ComponentProps<string>;
  checkedIcon: ComponentProps<string>;
  size: ComponentProps<string>;
  color: ComponentProps<string>;
};

export type StatisticsItemProps = {
  label: ComponentProps<string>;
  labelAbbreviation: ComponentProps<string>;
  value: ComponentProps<string>;
};

export type StatisticsCardProps = {
  title: ComponentProps<string>;
};

type StockStatisticsProps = {
  raw: number;
  fmt: string;
  longFmt?: string;
};

/** A single statement period row. Yahoo line items are sparse, so all optional. */
type StatementRow = {
  endDate?: StockStatisticsProps;
} & Partial<Record<string, StockStatisticsProps>>;

type IncomeStatementHistory = {
  incomeStatementHistory: StatementRow[];
};

type BalanceSheetHistory = {
  balanceSheetStatements: StatementRow[];
};

type CashflowStatementHistory = {
  cashflowStatements: StatementRow[];
};

type PriceModule = {
  marketCap?: StockStatisticsProps;
  regularMarketPrice?: StockStatisticsProps;
  regularMarketChange?: StockStatisticsProps;
  regularMarketChangePercent?: StockStatisticsProps;
  currency?: string;
  currencySymbol?: string;
};

type SummaryDetail = {
  trailingPE?: StockStatisticsProps;
  forwardPE?: StockStatisticsProps;
  priceToSalesTrailing12Months?: StockStatisticsProps;
  dividendYield?: StockStatisticsProps;
  payoutRatio?: StockStatisticsProps;
  beta?: StockStatisticsProps;
  marketCap?: StockStatisticsProps;
};

type EarningsTrendModule = {
  trend: Array<{
    period?: string;
    growth?: StockStatisticsProps;
    earningsEstimate?: { growth?: StockStatisticsProps };
    revenueEstimate?: { growth?: StockStatisticsProps };
  }>;
};

export type StockData = {
  quoteSummary: {
    result: [
      {
        assetProfile: {
          website: string;
          longBusinessSummary: string;
          sector?: string;
          industry?: string;
          country?: string;
          fullTimeEmployees?: number;
        };
        quoteType: {
          exchange: string;
          longName: string;
          shortName: string;
          symbol: string;
          uuid: string;
        };
        defaultKeyStatistics: {
          enterpriseValue: StockStatisticsProps;
          marketCap?: StockStatisticsProps;
          forwardPE: StockStatisticsProps;
          trailingPE?: StockStatisticsProps;
          pegRatio: StockStatisticsProps;
          priceToBook: StockStatisticsProps;
          enterpriseToRevenue: StockStatisticsProps;
          enterpriseToEbitda: StockStatisticsProps;
          lastFiscalYearEnd: StockStatisticsProps;
          mostRecentQuarter: StockStatisticsProps;
          netIncomeToCommon: StockStatisticsProps;
          trailingEps: StockStatisticsProps;
          quarterlyEarningsGrowth: StockStatisticsProps;
          sharesOutstanding: StockStatisticsProps;
          floatShares: StockStatisticsProps;
          heldPercentInsiders: StockStatisticsProps;
          heldPercentInstitutions: StockStatisticsProps;
          lastDividendDate: StockStatisticsProps;
          lastDividendValue: StockStatisticsProps;
          lastSplitDate: StockStatisticsProps;
          lastSplitFactor: string | undefined;
          '52WeekChange': StockStatisticsProps;
          beta?: StockStatisticsProps;
          dividendYield?: StockStatisticsProps;
          payoutRatio?: StockStatisticsProps;
          exDividendDate?: StockStatisticsProps;
        };
        financialData: {
          currentPrice: StockStatisticsProps;
          profitMargins: StockStatisticsProps;
          operatingMargins: StockStatisticsProps;
          grossMargins?: StockStatisticsProps;
          totalRevenue: StockStatisticsProps;
          revenuePerShare: StockStatisticsProps;
          revenueGrowth: StockStatisticsProps;
          grossProfits: StockStatisticsProps;
          ebitda: StockStatisticsProps;
          returnOnAssets: StockStatisticsProps;
          returnOnEquity: StockStatisticsProps;
          totalCash: StockStatisticsProps;
          totalCashPerShare: StockStatisticsProps;
          totalDebt: StockStatisticsProps;
          debtToEquity: StockStatisticsProps;
          currentRatio: StockStatisticsProps;
          quickRatio?: StockStatisticsProps;
          operatingCashflow: StockStatisticsProps;
          freeCashflow: StockStatisticsProps;
          targetMeanPrice: StockStatisticsProps;
          targetLowPrice: StockStatisticsProps;
          financialCurrency: string;
          recommendationKey: string;
          volume?: StockStatisticsProps;
        };
        price?: PriceModule;
        summaryDetail?: SummaryDetail;
        incomeStatementHistory?: IncomeStatementHistory;
        balanceSheetHistory?: BalanceSheetHistory;
        cashflowStatementHistory?: CashflowStatementHistory;
        earningsTrend?: EarningsTrendModule;
      }
    ];
    error: {
      code: string;
      description: string;
    };
  };
};

type Range = '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '2y' | '5y' | '10y' | 'ytd' | 'max';

export type StockChart = {
  chart: {
    result: [
      {
        meta: {
          currency?: string;
          range: Range;
          previousClose: number;
          validRanges: Range[];
        };
        timestamp: number[];
        indicators: {
          quote: [
            {
              volume: number[];
              close: number[];
              open: number[];
              high: number[];
              low: number[];
            }
          ];
        };
      }
    ];
    error: {
      code: string;
      description: string;
    };
  };
};

export type Theme = 'light' | 'dark';
