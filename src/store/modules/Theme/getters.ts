import type { ThemeGetters } from '@/types';

export default {
  currentTheme(state) {
    return state.currentTheme;
  }
} as ThemeGetters;
