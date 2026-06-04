import { ref } from 'vue';

import { defineStore } from 'pinia';

import config from '@/config';
import { financialRepository } from '@/shared/services/providers/FinancialDataRepository';
import type { NormalizedAsset } from '@/shared/types/domain';

interface CachedStockData {
  ts: number;
  asset: NormalizedAsset;
}

function normalizeSymbolExchange(fullSymbol: string): { symbol: string; exchange: string } {
  if (fullSymbol.endsWith(config.STOCK.BRAZIL_EXCHANGE_SUFFIX)) {
    return {
      symbol: fullSymbol.slice(0, -config.STOCK.BRAZIL_EXCHANGE_SUFFIX.length),
      exchange: config.STOCK.BRAZIL_EXCHANGE_SUFFIX
    };
  }
  return { symbol: fullSymbol, exchange: '' };
}

function buildQualifiedSymbol(symbol: string, exchange: string): string {
  return symbol + exchange;
}

function isValidCachedData(data: unknown): data is CachedStockData {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.ts !== 'number') {
    return false;
  }

  const asset = obj.asset;
  if (!asset || typeof asset !== 'object') {
    return false;
  }

  const assetObj = asset as Record<string, unknown>;
  return (
    'profile' in assetObj &&
    'thesis' in assetObj &&
    'research' in assetObj &&
    'provenance' in assetObj
  );
}

function isCacheFresh(cachedAt: number): boolean {
  return Date.now() - cachedAt < config.STOCK.CACHE_TTL_MS;
}

export const useStockStore = defineStore('stock', () => {
  const symbol = ref<string>(config.STOCK.DEFAULT_SYMBOL);
  const exchange = ref<string>('');
  const range = ref<string>(config.STOCK.DEFAULT_RANGE);

  const currentAsset = ref<NormalizedAsset | null>(null);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const cachedAt = ref<number | null>(null);

  function initializeFromCache(): void {
    try {
      const cached = localStorage.getItem(config.STORAGE.STOCK_CACHE_KEY);
      if (!cached) return;

      const parsed = JSON.parse(cached) as unknown;
      if (!isValidCachedData(parsed)) {
        localStorage.removeItem(config.STORAGE.STOCK_CACHE_KEY);
        return;
      }

      if (!isCacheFresh(parsed.ts)) {
        localStorage.removeItem(config.STORAGE.STOCK_CACHE_KEY);
        return;
      }

      currentAsset.value = parsed.asset;
      cachedAt.value = parsed.ts;

      const { symbol: parsedSymbol, exchange: parsedExchange } = normalizeSymbolExchange(
        parsed.asset.profile.symbol
      );
      symbol.value = parsedSymbol;
      exchange.value = parsedExchange;
    } catch (err) {
      console.error('Failed to restore cached stock data:', err);
      localStorage.removeItem(config.STORAGE.STOCK_CACHE_KEY);
    }
  }

  async function fetchStock(
    targetSymbol: string,
    targetExchange: string,
    targetRange = range.value
  ): Promise<void> {
    const qualifiedSymbol = buildQualifiedSymbol(targetSymbol, targetExchange);
    const isNewSymbol =
      !currentAsset.value ||
      qualifiedSymbol.toUpperCase() !== currentAsset.value?.profile.symbol.toUpperCase();

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

      const now = Date.now();
      cachedAt.value = now;
      const cacheData: CachedStockData = { ts: now, asset };
      localStorage.setItem(config.STORAGE.STOCK_CACHE_KEY, JSON.stringify(cacheData));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An error occurred while fetching financial data.';
      error.value = message;
      currentAsset.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  async function changeRange(newRange: string): Promise<void> {
    if (range.value === newRange) return;
    range.value = newRange;
    if (symbol.value) {
      await fetchStock(symbol.value, exchange.value, newRange);
    }
  }

  initializeFromCache();

  return {
    symbol,
    exchange,
    range,
    currentAsset,
    cachedAt,
    isLoading,
    error,
    fetchStock,
    changeRange
  };
});
