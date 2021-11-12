import { StockOverviewMutations } from '@/types';

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
  setStockOverview(state, payload) {
    state.stockOverview = payload;
  }
} as StockOverviewMutations;
