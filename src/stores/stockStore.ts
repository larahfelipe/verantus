import { ref } from 'vue';

import { defineStore } from 'pinia';

import { financialRepository } from '../shared/services/providers/FinancialDataRepository';
import type { NormalizedAsset } from '../shared/types/domain';

export const useStockStore = defineStore('stock', () => {
  const symbol = ref<string>('AAPL');
  const exchange = ref<string>('');
  const range = ref<string>('1mo');

  const currentAsset = ref<NormalizedAsset | null>(null);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const cacheKey = 'verantus@cached_stock';
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.profile) {
        currentAsset.value = parsed;
        symbol.value = parsed.profile.symbol.endsWith('.SA')
          ? parsed.profile.symbol.split('.')[0]
          : parsed.profile.symbol;
        exchange.value = parsed.profile.symbol.endsWith('.SA') ? '.SA' : '';
      }
    } catch (_) {
      // Ignore cache parsing errors and fall back to default state
    }
  }

  async function fetchStock(
    targetSymbol: string,
    targetExchange: string,
    targetRange = range.value
  ) {
    const isNewSymbol =
      !currentAsset.value ||
      (targetSymbol + targetExchange).toUpperCase() !==
        currentAsset.value.profile.symbol.toUpperCase();

    if (isNewSymbol) {
      currentAsset.value = null;
    }

    symbol.value = targetSymbol;
    exchange.value = targetExchange;
    range.value = targetRange;

    try {
      isLoading.value = true;
      error.value = null;

      const asset = await financialRepository.getAsset(targetSymbol, targetExchange, targetRange);
      currentAsset.value = asset;

      localStorage.setItem(cacheKey, JSON.stringify(asset));
    } catch (e) {
      error.value =
        e instanceof Error ? e.message : 'An error occurred while fetching financial data.';
      currentAsset.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  async function changeRange(newRange: string) {
    if (range.value === newRange) return;
    range.value = newRange;
    if (symbol.value) {
      await fetchStock(symbol.value, exchange.value, newRange);
    }
  }

  return {
    symbol,
    exchange,
    range,
    currentAsset,
    isLoading,
    error,
    fetchStock,
    changeRange
  };
});
