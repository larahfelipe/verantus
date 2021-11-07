import { createStore } from 'vuex';

import quoteOverviewModule from './modules/QuoteOverview';

const store = createStore({
  modules: {
    overview: quoteOverviewModule
  }
});

export default store;
