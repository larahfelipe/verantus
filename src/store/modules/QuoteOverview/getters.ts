import { QuoteOverviewGetters } from '@/types';

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
  quoteOverview(state) {
    return state.quoteOverview;
  }
} as QuoteOverviewGetters;
