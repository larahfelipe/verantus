import type { StockState } from '@/types';

import actions from './actions';
import getters from './getters';
import mutations from './mutations';

export default {
  namespaced: true,
  state(): StockState {
    return {
      isLoading: false,
      isFetching: false,
      error: null,
      stockData: null,
      stockChart: null
    };
  },
  getters,
  mutations,
  actions
};
