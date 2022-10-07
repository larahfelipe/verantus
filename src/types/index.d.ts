import type { PropType } from 'vue';

import type { QOptionGroupProps, QSkeletonProps } from 'quasar';
import type { ActionContext } from 'vuex';

export type StockPayload = {
  symbol: string;
  exchange: string;
  modules: string;
  range: string;
};

type ComponentProps<T = unknown> = {
  type: PropType<T>;
  required: boolean;
  default?: T;
};

export type InputFieldProps = {
  type: ComponentProps<string>;
  placeholder: ComponentProps<string>;
};

export type SelectOption = {
  label: string;
  value: string;
};

export type SelectInputProps = {
  options: ComponentProps<SelectOption[]>;
};

export type ButtonType = 'submit' | 'button' | 'reset';

export type ButtonProps = {
  type: ComponentProps<ButtonType>;
};

export type ToggleInputProps = {
  value: ComponentProps<boolean>;
  uncheckedIcon: ComponentProps<string>;
  checkedIcon: ComponentProps<string>;
  size: ComponentProps<string>;
  color: ComponentProps<string>;
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
  data: ComponentProps<StockDataDestructured>;
};

export type StatisticsItemProps = {
  longLabel: ComponentProps<string>;
  shortLabel: ComponentProps<string>;
  value: ComponentProps<string>;
};

export type StatisticsTabProps = {
  data: ComponentProps<StockDataDestructured>;
};

export type StockChartTabProps = {
  data: ComponentProps<StockChartDestructured>;
};

type StockDataDestructured = StockOverview['quoteSummary']['result'][0];

type StockChartDestructured = StockChart['chart']['result'][0];

type StockStatisticsProps = {
  raw: number;
  fmt: string;
  longFmt?: string;
};

export type StockData = {
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

export type StockState = {
  isLoading: boolean;
  isFetched: boolean;
  error: any;
  stockData: StockData | null;
  stockChart: StockChart | null;
};

export type StockGetters = {
  isLoading: (state: StockState) => boolean;
  isFetched: (state: StockState) => boolean;
  error: (state: StockState) => any;
  stockData: (state: StockState) => StockData;
  stockChart: (state: StockState) => StockChart;
};

export type StockMutations = {
  setIsLoading: (state: StockState, payload: boolean) => void;
  setIsFetched: (state: StockState, payload: boolean) => void;
  setError: (state: StockState, payload: boolean) => void;
  setStockData: (state: StockState, payload: StockData) => void;
  setStockChart: (state: StockState, payload: StockChart) => void;
};

export type StockActions = {
  fetchStockData: (
    context: ActionContext<StockData, unknown>,
    payload: StockPayload
  ) => void;
  fetchStockChart: (
    context: ActionContext<StockData, unknown>,
    payload: StockPayload
  ) => void;
};

export type Theme = 'light' | 'dark';

export type ThemeState = {
  currentTheme: Theme;
};

export type ThemeGetters = {
  currentTheme: (state: ThemeState) => string;
};

export type ThemeMutations = {
  setCurrentTheme: (state: ThemeState, payload: Theme) => void;
};
