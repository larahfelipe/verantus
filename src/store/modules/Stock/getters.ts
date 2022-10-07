import type { StockGetters } from '@/types';

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
  stockData(state) {
    return state.stockData;
  },
  stockChart(state) {
    return state.stockChart;
  }
} as StockGetters;
