<template>
  <div
    class="flex flex-col min-h-screen bg-neutral-50 dark:bg-zinc-950 text-neutral-900 dark:text-neutral-50 transition-colors duration-200"
  >
    <header
      class="w-full h-16 sticky top-0 z-50 flex items-center transition-all duration-300"
      :class="
        isScrolled
          ? 'bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md border-b border-neutral-200/50 dark:border-zinc-800/50 shadow-sm'
          : 'bg-transparent border-b border-transparent'
      "
    >
      <div
        class="w-full max-w-[1600px] mx-auto px-4 md:px-6 xl:px-8 flex justify-between items-center gap-4"
      >
        <div class="flex items-center gap-6">
          <div class="flex items-center cursor-pointer" @click="$router.push('/')">
            <span
              class="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-600 dark:from-white dark:via-neutral-200 dark:to-emerald-400 bg-clip-text text-transparent"
              >verantus</span
            >
          </div>

          <nav class="hidden md:flex items-center gap-1">
            <router-link
              to="/"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200"
              :class="
                $route.name === 'dashboard'
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                  : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:text-neutral-800 dark:hover:text-neutral-200'
              "
            >
              Dashboard
            </router-link>
          </nav>
        </div>

        <div class="flex items-center gap-4 flex-1 justify-end">
          <div class="relative w-full max-w-xs flex flex-col">
            <div
              class="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800/80 rounded-xl border border-transparent focus-within:border-emerald-500/80 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:bg-white dark:focus-within:bg-zinc-900 transition-all duration-200 w-full"
              :class="{
                'border-rose-500/50 focus-within:border-rose-500/80 focus-within:ring-2 focus-within:ring-rose-500/20':
                  error,
                'shadow-sm': isFocused
              }"
            >
              <input
                id="search-input"
                v-model.trim="symbolInput"
                type="text"
                placeholder="Search symbol (e.g. AAPL, PETR4)..."
                aria-label="Search asset ticker symbol"
                :disabled="isLoading"
                class="flex-1 bg-transparent text-xs font-semibold text-neutral-900 dark:text-neutral-50 placeholder-neutral-400 focus:outline-none w-full"
                @focus="isFocused = true"
                @blur="isFocused = false"
                @keyup.enter="handleSearch"
              />

              <button
                type="button"
                class="px-2 py-0.5 text-[10px] font-bold font-mono rounded bg-white dark:bg-zinc-700 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 border border-neutral-200 dark:border-neutral-600 transition-all duration-150 select-none focus:outline-none"
                aria-label="Toggle exchange market between US and Brazil"
                :disabled="isLoading"
                @click="toggleExchange"
              >
                {{ selectedExchange === '' ? 'US' : 'BR' }}
              </button>

              <button
                type="button"
                class="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors focus:outline-none"
                aria-label="Submit search"
                :disabled="isLoading || !symbolInput.length"
                @click="handleSearch"
              >
                <svg
                  class="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>

            <Transition name="slide-up">
              <div
                v-if="error"
                class="absolute top-full left-0 right-0 pt-1 text-[10px] font-bold text-rose-500 truncate z-10"
              >
                <span>{{ error }}</span>
              </div>
            </Transition>
          </div>

          <button
            id="theme-toggle"
            type="button"
            class="h-8 w-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 transition-all focus:outline-none"
            aria-label="Toggle light and dark color theme"
            @click="themeStore.toggleTheme()"
          >
            <svg
              v-if="themeStore.currentTheme === 'dark'"
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
              />
            </svg>
            <svg
              v-else
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <main class="flex-grow w-full max-w-[1600px] mx-auto px-4 md:px-6 xl:px-8 py-6">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';

import { useStockStore } from '../stores/stockStore';
import { useThemeStore } from '../stores/themeStore';

const stockStore = useStockStore();
const themeStore = useThemeStore();

const isFocused = ref(false);
const isScrolled = ref(false);
const symbolInput = ref('');
const selectedExchange = ref('');

const isLoading = computed(() => stockStore.isLoading);
const error = computed(() => stockStore.error);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 0;
};

onMounted(() => {
  themeStore.applyTheme();
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const handleSearch = async () => {
  if (!symbolInput.value.length || isLoading.value) return;
  await stockStore.fetchStock(symbolInput.value.toUpperCase(), selectedExchange.value);
  symbolInput.value = '';
};

const toggleExchange = () => {
  selectedExchange.value = selectedExchange.value === '' ? '.SA' : '';
};
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.2s ease-out;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(2px);
}
</style>
