import { ActionContext } from 'vuex';

export type ComponentProps = {
  type: any;
  required?: boolean;
  default: any;
};

export type Payload = {
  stockSymbol: string;
  stockExchange: string;
  modules: string;
};

type QuoteStatisticsProps = {
  raw: number;
  fmt: string;
  longFmt?: string;
};

export type QuoteOverview = {
  quoteSummary: {
    result: [
      {
        assetProfile: {
          city: string;
          state: string;
          country: string;
          industry: string;
          sector: string;
          longBusinessSummary: string;
        };
        quoteType: {
          exchange: string;
          longName: string;
          quoteType: string;
          shortName: string;
          symbol: string;
          timeZoneFullName: string;
          timeZoneShortName: string;
          uuid: string;
        };
        defaultKeyStatistics: {
          '52WeekChange': QuoteStatisticsProps;
          enterpriseValue: QuoteStatisticsProps;
          forwardPE: QuoteStatisticsProps;
          profitMargins: QuoteStatisticsProps;
          floatShares: QuoteStatisticsProps;
          sharesOutstanding: QuoteStatisticsProps;
          bookValue: QuoteStatisticsProps;
          priceToBook: QuoteStatisticsProps;
          netIncomeToCommon: QuoteStatisticsProps;
          trailingEps: QuoteStatisticsProps;
          pegRatio: QuoteStatisticsProps;
          enterpriseToRevenue: QuoteStatisticsProps;
          enterpriseToEbitda: QuoteStatisticsProps;
          lastDividendValue: QuoteStatisticsProps;
          lastSplitDate: QuoteStatisticsProps;
          lastSplitFactor: string | number;
        };
        financialData: {
          financialCurrency: string;
          currentPrice: QuoteStatisticsProps;
          ebitda: QuoteStatisticsProps;
          totalRevenue: QuoteStatisticsProps;
          revenueGrowth: QuoteStatisticsProps;
          revenuePerShare: QuoteStatisticsProps;
          returnOnAssets: QuoteStatisticsProps;
          returnOnEquity: QuoteStatisticsProps;
          grossProfits: QuoteStatisticsProps;
        };
      }
    ];
  };
};

export type QuoteOverviewState = {
  isLoading: boolean;
  isFetched: boolean;
  error: any;
  quoteOverview: QuoteOverview;
};

export type QuoteOverviewGetters = {
  isLoading: (state: QuoteOverviewState) => boolean;
  isFetched: (state: QuoteOverviewState) => boolean;
  error: (state: QuoteOverviewState) => any;
  quoteOverview: (state: QuoteOverviewState) => QuoteOverview;
};

export type QuoteOverviewMutations = {
  setIsLoading: (state: QuoteOverviewState, payload: boolean) => void;
  setIsFetched: (state: QuoteOverviewState, payload: boolean) => void;
  setError: (state: QuoteOverviewState, payload: boolean) => void;
  setQuoteOverview: (state: QuoteOverviewState, payload: QuoteOverview) => void;
};

export type QuoteOverviewActions = {
  fetchQuoteOverview: (
    context: ActionContext<QuoteOverview, unknown>,
    payload: Payload
  ) => void;
};
