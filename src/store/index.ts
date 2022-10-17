import { createStore } from 'vuex';
import VuexPersist from 'vuex-persist';

import config from '@/config';

import stockModule from './modules/Stock';
import themeModule from './modules/Theme';

const vuexPersist = new VuexPersist({
  key: config.appStorageKey,
  storage: window.localStorage
});

const store = createStore({
  modules: {
    stock: stockModule,
    theme: themeModule
  },
  plugins: [vuexPersist.plugin]
});

export default store;
