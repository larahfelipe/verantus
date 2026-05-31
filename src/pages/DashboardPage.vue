<template>
  <div class="space-y-6">
    <div v-if="stockStore.isLoading && !stockStore.currentAsset" class="space-y-6 animate-pulse">
      <div
        class="rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6"
      >
        <div class="flex items-start gap-4">
          <div class="h-12 w-12 rounded-lg bg-neutral-200 dark:bg-zinc-800 shrink-0" />
          <div class="space-y-2 flex-grow">
            <div class="h-6 bg-neutral-200 dark:bg-zinc-800 rounded-md w-1/3" />
            <div class="h-4 bg-neutral-200 dark:bg-zinc-800 rounded-md w-1/4" />
          </div>
        </div>
        <div
          class="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 mt-4 border-t border-neutral-100 dark:border-neutral-800"
        >
          <div class="space-y-1.5">
            <div class="h-3 bg-neutral-100 dark:bg-zinc-800/60 rounded w-1/2" />
            <div class="h-5 bg-neutral-200 dark:bg-zinc-800 rounded w-3/4" />
          </div>
          <div class="space-y-1.5">
            <div class="h-3 bg-neutral-100 dark:bg-zinc-800/60 rounded w-1/2" />
            <div class="h-5 bg-neutral-200 dark:bg-zinc-800 rounded w-1/2" />
          </div>
          <div class="space-y-1.5">
            <div class="h-3 bg-neutral-100 dark:bg-zinc-800/60 rounded w-1/2" />
            <div class="h-5 bg-neutral-200 dark:bg-zinc-800 rounded w-2/3" />
          </div>
          <div class="space-y-1.5">
            <div class="h-3 bg-neutral-100 dark:bg-zinc-800/60 rounded w-1/2" />
            <div class="h-5 bg-neutral-200 dark:bg-zinc-800 rounded w-1/3" />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div
          class="rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6 h-[400px] flex flex-col justify-between"
        >
          <div class="space-y-2">
            <div class="h-3 bg-neutral-200 dark:bg-zinc-800 rounded w-1/4" />
            <div class="h-5 bg-neutral-200 dark:bg-zinc-800 rounded w-1/3" />
          </div>
          <div class="h-48 bg-neutral-100 dark:bg-zinc-800/40 rounded-xl my-4" />
          <div class="flex justify-between items-center">
            <div class="h-4 bg-neutral-200 dark:bg-zinc-800 rounded w-16" />
            <div class="h-4 bg-neutral-200 dark:bg-zinc-800 rounded w-16" />
            <div class="h-4 bg-neutral-200 dark:bg-zinc-800 rounded w-16" />
          </div>
        </div>
        <div
          class="rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6 h-[400px] flex flex-col justify-between"
        >
          <div class="h-4 bg-neutral-200 dark:bg-zinc-800 rounded w-1/4 mb-4" />
          <div class="space-y-6 flex-grow">
            <div class="space-y-2">
              <div class="h-3 bg-neutral-100 dark:bg-zinc-800/60 rounded w-1/6" />
              <div class="h-4 bg-neutral-200 dark:bg-zinc-800 rounded" />
            </div>
            <div class="space-y-2">
              <div class="h-3 bg-neutral-100 dark:bg-zinc-800/60 rounded w-1/5" />
              <div class="h-4 bg-neutral-200 dark:bg-zinc-800 rounded" />
            </div>
            <div class="space-y-2">
              <div class="h-3 bg-neutral-100 dark:bg-zinc-800/60 rounded w-1/4" />
              <div class="h-4 bg-neutral-200 dark:bg-zinc-800 rounded" />
            </div>
            <div class="space-y-2">
              <div class="h-3 bg-neutral-100 dark:bg-zinc-800/60 rounded w-1/6" />
              <div class="h-4 bg-neutral-200 dark:bg-zinc-800 rounded" />
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div
          class="rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6 h-64 flex flex-col justify-between"
        >
          <div class="h-4 bg-neutral-200 dark:bg-zinc-800 rounded w-1/4" />
          <div class="space-y-4 flex-grow mt-6">
            <div class="h-4 bg-neutral-100 dark:bg-zinc-800/60 rounded w-full" />
            <div class="h-4 bg-neutral-100 dark:bg-zinc-800/60 rounded w-5/6" />
            <div class="h-4 bg-neutral-100 dark:bg-zinc-800/60 rounded w-3/4" />
          </div>
        </div>
        <div
          class="rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6 h-64 flex flex-col justify-between"
        >
          <div class="h-4 bg-neutral-200 dark:bg-zinc-800 rounded w-1/4" />
          <div class="space-y-4 flex-grow mt-6">
            <div class="h-4 bg-neutral-100 dark:bg-zinc-800/60 rounded w-full" />
            <div class="h-4 bg-neutral-100 dark:bg-zinc-800/60 rounded w-5/6" />
            <div class="h-4 bg-neutral-100 dark:bg-zinc-800/60 rounded w-3/4" />
          </div>
        </div>
      </div>

      <div
        class="rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6"
      >
        <div class="h-4 bg-neutral-200 dark:bg-zinc-800 rounded w-1/6 mb-6" />
        <div class="space-y-4">
          <div class="h-8 bg-neutral-100 dark:bg-zinc-800/40 rounded" />
          <div class="h-8 bg-neutral-100 dark:bg-zinc-800/40 rounded" />
          <div class="h-8 bg-neutral-100 dark:bg-zinc-800/40 rounded" />
        </div>
      </div>

      <div
        class="rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6"
      >
        <div class="h-4 bg-neutral-200 dark:bg-zinc-800 rounded w-1/5 mb-6" />
        <div class="space-y-4">
          <div class="h-8 bg-neutral-100 dark:bg-zinc-800/40 rounded" />
          <div class="h-8 bg-neutral-100 dark:bg-zinc-800/40 rounded" />
        </div>
      </div>
    </div>

    <div
      v-else-if="stockStore.error"
      class="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-rose-500/5 rounded-3xl border border-rose-500/10"
    >
      <svg
        class="w-12 h-12 text-rose-500 mb-4"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <h3 class="text-lg font-black text-rose-600 dark:text-rose-400">Data Fetching Failed</h3>
      <p class="text-xs text-neutral-500 max-w-md mt-2">
        {{ stockStore.error }}
      </p>
      <button
        type="button"
        class="mt-6 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all"
        @click="retryFetch"
      >
        Retry Fetch
      </button>
    </div>

    <div v-else-if="stockStore.currentAsset" class="space-y-6">
      <AssetOverviewCard :asset="stockStore.currentAsset" />

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <StockHistoryChart :asset="stockStore.currentAsset" />
        <QuantitativeScoresCard :asset="stockStore.currentAsset" />
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ValuationMetricsCard :asset="stockStore.currentAsset" />
        <DividendsCard :asset="stockStore.currentAsset" />
      </div>

      <CondensedStatements :asset="stockStore.currentAsset" />

      <PeerComparisonGrid :asset="stockStore.currentAsset" />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          class="p-6 bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl shadow-sm space-y-4"
        >
          <h3
            class="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider"
          >
            Valuation Analysis
          </h3>
          <p class="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            Comparing price-to-earnings multiples across sector peers helps identify potential
            market discounts or premiums. A peer trading significantly below the group average with
            similar ROE profiles represents a high-probability margin-of-safety candidate.
          </p>
          <div
            class="p-4 rounded-2xl bg-neutral-50 dark:bg-zinc-800/40 border border-neutral-100 dark:border-neutral-800/40 text-xs"
          >
            <div class="flex items-center justify-between font-semibold">
              <span class="text-neutral-500">Asset P/E:</span>
              <span class="text-neutral-800 dark:text-neutral-200">{{
                stockStore.currentAsset.metrics.valuation.pe?.toFixed(2) || '—'
              }}</span>
            </div>
            <div class="flex items-center justify-between font-semibold mt-2">
              <span class="text-neutral-500">Peer Group Average P/E:</span>
              <span class="text-neutral-800 dark:text-neutral-200">{{ peerPeAvg.toFixed(2) }}</span>
            </div>
            <div
              class="border-t border-neutral-200/50 dark:border-neutral-700/50 pt-2 mt-2 flex items-center justify-between font-bold text-emerald-600 dark:text-emerald-400"
            >
              <span>Spread:</span>
              <span>{{ spreadLabel }}</span>
            </div>
          </div>
        </div>

        <div
          class="p-6 bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl shadow-sm space-y-4"
        >
          <h3
            class="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider"
          >
            Profitability Spread
          </h3>
          <p class="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            Return on Equity (ROE) measures how efficiently a company generates profits from
            shareholder capital. Companies exhibiting double-digit ROE alongside low debt profiles
            denote high-quality compounders with deep economic moats.
          </p>
          <div
            class="p-4 rounded-2xl bg-neutral-50 dark:bg-zinc-800/40 border border-neutral-100 dark:border-neutral-800/40 text-xs"
          >
            <div class="flex items-center justify-between font-semibold">
              <span class="text-neutral-500">Asset ROE:</span>
              <span class="text-neutral-800 dark:text-neutral-200"
                >{{ (stockStore.currentAsset.metrics.profitability.roe! * 100).toFixed(1) }}%</span
              >
            </div>
            <div class="flex items-center justify-between font-semibold mt-2">
              <span class="text-neutral-500">Peer Group Average ROE:</span>
              <span class="text-neutral-800 dark:text-neutral-200"
                >{{ (peerRoeAvg * 100).toFixed(1) }}%</span
              >
            </div>
            <div
              class="border-t border-neutral-200/50 dark:border-neutral-700/50 pt-2 mt-2 flex items-center justify-between font-bold text-emerald-600 dark:text-emerald-400"
            >
              <span>Spread:</span>
              <span>{{ roeSpreadLabel }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center min-h-[400px]">
      <p class="text-xs text-neutral-500 font-bold">
        Use the search box above to search for assets.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';

import AssetOverviewCard from '../modules/asset-analysis/components/AssetOverviewCard.vue';
import QuantitativeScoresCard from '../modules/asset-analysis/components/QuantitativeScoresCard.vue';
import StockHistoryChart from '../modules/asset-analysis/components/StockHistoryChart.vue';
import PeerComparisonGrid from '../modules/comparison/components/PeerComparisonGrid.vue';
import DividendsCard from '../modules/dividends/components/DividendsCard.vue';
import CondensedStatements from '../modules/financial-statements/components/CondensedStatements.vue';
import ValuationMetricsCard from '../modules/valuation/components/ValuationMetricsCard.vue';
import { useStockStore } from '../stores/stockStore';

const stockStore = useStockStore();

const peerPeAvg = computed(() => {
  if (!stockStore.currentAsset || !stockStore.currentAsset.peers.length) return 0;
  const peers = stockStore.currentAsset.peers;
  const valid = peers.filter((p) => p.metrics.pe !== null).map((p) => p.metrics.pe as number);
  if (!valid.length) return 0;
  return valid.reduce((acc, curr) => acc + curr, 0) / valid.length;
});

const peerRoeAvg = computed(() => {
  if (!stockStore.currentAsset || !stockStore.currentAsset.peers.length) return 0;
  const peers = stockStore.currentAsset.peers;
  const valid = peers.filter((p) => p.metrics.roe !== null).map((p) => p.metrics.roe as number);
  if (!valid.length) return 0;
  return valid.reduce((acc, curr) => acc + curr, 0) / valid.length;
});

const spreadLabel = computed(() => {
  const assetPe = stockStore.currentAsset?.metrics.valuation.pe;
  if (assetPe === undefined || assetPe === null) return '—';
  const diff = assetPe - peerPeAvg.value;
  if (diff < 0) return `${Math.abs(diff).toFixed(2)} pts discount`;
  return `${diff.toFixed(2)} pts premium`;
});

const roeSpreadLabel = computed(() => {
  const assetRoe = stockStore.currentAsset?.metrics.profitability.roe;
  if (assetRoe === undefined || assetRoe === null) return '—';
  const diff = assetRoe - peerRoeAvg.value;
  if (diff > 0) return `+${(diff * 100).toFixed(1)}% premium`;
  return `${(diff * 100).toFixed(1)}% discount`;
});

onMounted(async () => {
  if (!stockStore.currentAsset) {
    await stockStore.fetchStock('AAPL', '');
  }
});

const retryFetch = async () => {
  await stockStore.fetchStock(stockStore.symbol || 'AAPL', stockStore.exchange || '');
};
</script>
