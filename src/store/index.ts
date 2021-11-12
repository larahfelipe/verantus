import { createStore } from 'vuex';

import stockOverviewModule from './modules/StockOverview';

const store = createStore({
  modules: {
    overview: stockOverviewModule
  }
});

export default store;
