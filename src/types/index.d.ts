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

type QuoteDefaultKeyStatisticsProps = {
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
        defaultKeyStatistics: {
          enterpriseValue: QuoteDefaultKeyStatisticsProps;
          forwardPE: QuoteDefaultKeyStatisticsProps;
          profitMargins: QuoteDefaultKeyStatisticsProps;
          floatShares: QuoteDefaultKeyStatisticsProps;
          sharesOutstanding: QuoteDefaultKeyStatisticsProps;
          bookValue: QuoteDefaultKeyStatisticsProps;
          priceToBook: QuoteDefaultKeyStatisticsProps;
          netIncomeToCommon: QuoteDefaultKeyStatisticsProps;
          trailingEps: QuoteDefaultKeyStatisticsProps;
          pegRatio: QuoteDefaultKeyStatisticsProps;
          enterpriseToRevenue: QuoteDefaultKeyStatisticsProps;
          enterpriseToEbitda: QuoteDefaultKeyStatisticsProps;
          lastDividendValue: QuoteDefaultKeyStatisticsProps;
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
