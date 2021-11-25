import { StockOverviewGetters } from '@/types';

export default {
  isLoading(state) {
    return state.isLoading;
  },
  isFetched(state) {
    return state.isFetched;
  },
  error(state) {
    return state.error;
  },
  stockOverview(state) {
    return state.stockOverview;
  },
  stockChart(state) {
    return state.stockChart;
  }
} as StockOverviewGetters;
