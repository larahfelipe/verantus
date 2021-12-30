import { PropType } from 'vue';

import { QOptionGroupProps, QSkeletonProps } from 'quasar';
import { ActionContext } from 'vuex';

export type Payload = {
  stockSymbol: string;
  stockExchange: string;
  modules: string;
  range: string;
};

type ComponentProps<T = unknown> = {
  type: PropType<T>;
  required: boolean;
  default?: unknown;
};

export type SearchInputFieldProps = {
  label: ComponentProps<string>;
  loading: ComponentProps<boolean>;
};

export type ExchangeOptionInputProps = {
  options: ComponentProps<QOptionGroupProps['options']>;
};

export type SkeletonLoaderProps = {
  type: ComponentProps<QSkeletonProps['type']>;
  width: ComponentProps<string | string[]>;
  height: ComponentProps<string | string[]>;
  repeat: ComponentProps<boolean>;
};

export type SummaryTabProps = {
  text: ComponentProps<string>;
};

export type StockOverviewBodyTitleProps = {
  symbol: ComponentProps<string>;
  data: ComponentProps<StockOverviewDestructured>;
};

export type StatisticsItemProps = {
  longLabel: ComponentProps<string>;
  shortLabel: ComponentProps<string>;
  value: ComponentProps<string>;
};

export type StatisticsTabProps = {
  data: ComponentProps<StockOverviewDestructured>;
};

export type StockChartTabProps = {
  data: ComponentProps<StockChartDestructured>;
};

type StockOverviewDestructured = StockOverview['quoteSummary']['result'][0];

type StockChartDestructured = StockChart['chart']['result'][0];

type StockStatisticsProps = {
  raw: number;
  fmt: string;
  longFmt?: string;
};

export type StockOverview = {
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
          '52WeekChange': StockStatisticsProps;
          enterpriseValue: StockStatisticsProps;
          forwardPE: StockStatisticsProps;
          profitMargins: StockStatisticsProps;
          floatShares: StockStatisticsProps;
          sharesOutstanding: StockStatisticsProps;
          bookValue: StockStatisticsProps;
          priceToBook: StockStatisticsProps;
          netIncomeToCommon: StockStatisticsProps;
          trailingEps: StockStatisticsProps;
          pegRatio: StockStatisticsProps;
          enterpriseToRevenue: StockStatisticsProps;
          enterpriseToEbitda: StockStatisticsProps;
          lastDividendValue: StockStatisticsProps;
          lastSplitDate: StockStatisticsProps;
          lastSplitFactor: string | undefined;
        };
        financialData: {
          financialCurrency: string;
          currentPrice: StockStatisticsProps;
          ebitda: StockStatisticsProps;
          totalRevenue: StockStatisticsProps;
          revenueGrowth: StockStatisticsProps;
          revenuePerShare: StockStatisticsProps;
          returnOnAssets: StockStatisticsProps;
          returnOnEquity: StockStatisticsProps;
          grossProfits: StockStatisticsProps;
        };
      }
    ];
  };
};

export type StockChart = {
  chart: {
    result: [
      meta: {
        symbol: string;
        currency: string;
        exchangeName: string;
        instrumentType: string;
        exchangeTimezoneName: string;
        range: string;
      },
      timestamp: number[],
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
      }
    ];
  };
};

export type StockOverviewState = {
  isLoading: boolean;
  isFetched: boolean;
  error: any;
  stockOverview: StockOverview;
  stockChart: StockChart;
};

export type StockOverviewGetters = {
  isLoading: (state: StockOverviewState) => boolean;
  isFetched: (state: StockOverviewState) => boolean;
  error: (state: StockOverviewState) => any;
  stockOverview: (state: StockOverviewState) => StockOverview;
  stockChart: (state: StockOverviewState) => StockChart;
};

export type StockOverviewMutations = {
  setIsLoading: (state: StockOverviewState, payload: boolean) => void;
  setIsFetched: (state: StockOverviewState, payload: boolean) => void;
  setError: (state: StockOverviewState, payload: boolean) => void;
  setStockOverview: (state: StockOverviewState, payload: StockOverview) => void;
  setStockChart: (state: StockOverviewState, payload: StockChart) => void;
};

export type StockOverviewActions = {
  fetchStockOverview: (
    context: ActionContext<StockOverview, unknown>,
    payload: Payload
  ) => void;
  fetchStockChart: (
    context: ActionContext<StockOverview, unknown>,
    payload: Payload
  ) => void;
};
