import type { ThemeState } from '@/types';

import getters from './getters';
import mutations from './mutations';

export default {
  namespaced: true,
  state(): ThemeState {
    return {
      currentTheme: 'light'
    };
  },
  getters,
  mutations
};
