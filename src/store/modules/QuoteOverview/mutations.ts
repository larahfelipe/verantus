import { QuoteOverviewMutations } from '@/types';

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
  setQuoteOverview(state, payload) {
    state.quoteOverview = payload;
  }
} as QuoteOverviewMutations;
