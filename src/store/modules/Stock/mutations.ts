import type { StockMutations } from '@/types';

export default {
  setIsLoading(state, payload) {
    state.isLoading = payload;
  },
  setIsFetched(state, payload) {
    state.isFetched = payload;
  },
  setError(state, payload) {
    state.error = payload;
  },
  setStockData(state, payload) {
    state.stockData = payload;
  },
  setStockChart(state, payload) {
    state.stockChart = payload;
  }
} as StockMutations;
