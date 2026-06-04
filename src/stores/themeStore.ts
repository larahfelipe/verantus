import { ref } from 'vue';

import { defineStore } from 'pinia';

import config from '@/config';

const getInitialTheme = (): 'light' | 'dark' => {
  const cached = localStorage.getItem(config.STORAGE.THEME_KEY);
  if (cached === 'light' || cached === 'dark') return cached;

  const prefersLight =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: light)').matches;

  return prefersLight ? 'light' : 'dark';
};

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<'light' | 'dark'>(getInitialTheme());

  function toggleTheme() {
    currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark';
    localStorage.setItem(config.STORAGE.THEME_KEY, currentTheme.value);
    applyTheme();
  }

  function applyTheme() {
    if (currentTheme.value === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('body--dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('body--dark');
    }
  }

  return {
    currentTheme,
    toggleTheme,
    applyTheme
  };
});
