import { ref } from 'vue';

import { defineStore } from 'pinia';

const getInitialTheme = (): 'light' | 'dark' => {
  const cached = localStorage.getItem('verantus@theme');
  if (cached === 'light' || cached === 'dark') return cached;

  if (
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }

  return 'dark';
};

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<'light' | 'dark'>(getInitialTheme());

  function toggleTheme() {
    currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark';
    localStorage.setItem('verantus@theme', currentTheme.value);
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
