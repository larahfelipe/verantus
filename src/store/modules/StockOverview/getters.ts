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
  }
} as StockOverviewGetters;
