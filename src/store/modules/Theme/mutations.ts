import type { ThemeMutations } from '@/types';

export default {
  setCurrentTheme(state, payload) {
    state.currentTheme = payload;
  }
} as ThemeMutations;
