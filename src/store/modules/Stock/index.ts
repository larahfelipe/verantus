import type { StockState } from '@/types';

import actions from './actions';
import getters from './getters';
import mutations from './mutations';

export default {
  namespaced: true,
  state(): StockState {
    return {
      isLoading: false,
      isFetched: false,
      error: null,
      stockData: null,
      stockChart: null
    };
  },
  getters,
  mutations,
  actions
};
