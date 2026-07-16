// @vitest-environment jsdom
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import config from '@/config';
import { NotFoundError } from '@/shared/services/errors';
import { financialRepository } from '@/shared/services/providers/FinancialDataRepository';
import type { NormalizedAsset } from '@/shared/types/domain';

import { useStockStore } from './stockStore';

vi.mock('@/shared/services/providers/FinancialDataRepository', () => ({
  financialRepository: { getAsset: vi.fn() }
}));

const CACHE_KEY = config.STORAGE.STOCK_CACHE_KEY;

const fakeAsset = (symbol: string) =>
  ({
    profile: { symbol },
    metrics: {},
    scores: {},
    history: [],
    financialsHistory: [],
    evolutionStats: {},
    thesis: {},
    research: {},
    provenance: {}
  }) as unknown as NormalizedAsset;

const seedCache = (asset: NormalizedAsset, ts: number) =>
  localStorage.setItem(CACHE_KEY, JSON.stringify({ ts, asset }));

describe('useStockStore', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
    vi.mocked(financialRepository.getAsset).mockReset();
  });

  it('loads an asset and caches it on success', async () => {
    vi.mocked(financialRepository.getAsset).mockResolvedValue(fakeAsset('AAPL'));

    const store = useStockStore();
    await store.fetchStock('AAPL', '');

    expect(store.currentAsset?.profile.symbol).toBe('AAPL');
    expect(store.error).toBeNull();
    expect(store.errorKind).toBeNull();
    expect(localStorage.getItem(CACHE_KEY)).not.toBeNull();
  });

  it('surfaces a typed not-found error as non-retryable and clears the asset', async () => {
    vi.mocked(financialRepository.getAsset).mockRejectedValue(new NotFoundError('unknown ticker'));

    const store = useStockStore();
    await store.fetchStock('NOPE', '');

    expect(store.errorKind).toBe('not_found');
    expect(store.errorRetryable).toBe(false);
    expect(store.error).not.toContain('unknown ticker');
    expect(store.currentAsset).toBeNull();
  });

  it('treats an unknown error as retryable', async () => {
    vi.mocked(financialRepository.getAsset).mockRejectedValue(new Error('boom'));

    const store = useStockStore();
    await store.fetchStock('AAPL', '');

    expect(store.errorKind).toBe('unknown');
    expect(store.errorRetryable).toBe(true);
  });

  it('restores a fresh cache on init and splits a .SA symbol', () => {
    seedCache(fakeAsset('PETR4.SA'), Date.now());

    const store = useStockStore();

    expect(store.currentAsset?.profile.symbol).toBe('PETR4.SA');
    expect(store.symbol).toBe('PETR4');
    expect(store.exchange).toBe('.SA');
  });

  it('evicts a stale cache on init', () => {
    seedCache(fakeAsset('AAPL'), Date.now() - config.STOCK.CACHE_TTL_MS - 1000);

    const store = useStockStore();

    expect(store.currentAsset).toBeNull();
    expect(localStorage.getItem(CACHE_KEY)).toBeNull();
  });

  it('evicts a structurally invalid cache on init', () => {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), asset: { profile: {} } }));

    const store = useStockStore();

    expect(store.currentAsset).toBeNull();
    expect(localStorage.getItem(CACHE_KEY)).toBeNull();
  });
});
