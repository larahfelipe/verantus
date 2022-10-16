import type { StockGetters } from '@/types';

export default {
  isLoading(state) {
    return state.isLoading;
  },
  isFetching(state) {
    return state.isFetching;
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
