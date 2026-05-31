<template>
  <div
    v-if="asset"
    class="rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6 transition-all duration-200"
  >
    <div class="border-b border-neutral-100 dark:border-neutral-800 pb-4">
      <h2 class="text-sm font-bold uppercase tracking-wider text-neutral-400">Peer Benchmarking</h2>
      <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
        Cross-sectional comparison in the {{ asset.profile.sector }} sector
      </p>
    </div>

    <div class="mt-6 overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr
            class="border-b border-neutral-100 dark:border-neutral-800 text-neutral-400 uppercase font-bold tracking-wider"
          >
            <th scope="col" class="py-3 px-4">Ticker</th>
            <th scope="col" class="py-3 px-4">Company Name</th>
            <th scope="col" class="py-3 px-4 text-right">P/E Multiple</th>
            <th scope="col" class="py-3 px-4 text-right">ROE</th>
            <th scope="col" class="py-3 px-4 text-right">Net Margin</th>
            <th scope="col" class="py-3 px-4 text-right">Debt / Equity</th>
            <th scope="col" class="py-3 px-4 text-right">Current Ratio</th>
            <th scope="col" class="py-3 px-4 text-right">Dividend Yield</th>
          </tr>
        </thead>
        <tbody
          class="divide-y divide-neutral-100 dark:divide-neutral-800/60 text-neutral-700 dark:text-neutral-300"
        >
          <tr
            class="bg-emerald-50/30 dark:bg-emerald-950/20 font-bold text-emerald-600 dark:text-emerald-400"
          >
            <th scope="row" class="py-3.5 px-4 text-left rounded-l-lg">
              {{
                asset.profile.symbol.endsWith('.SA')
                  ? asset.profile.symbol.split('.')[0]
                  : asset.profile.symbol
              }}
              <span class="sr-only">(Current Selected Asset)</span>
            </th>
            <td class="py-3.5 px-4">{{ asset.profile.name }}</td>
            <td class="py-3.5 px-4 text-right">
              {{ formatNum(asset.metrics.valuation.pe) }}
            </td>
            <td class="py-3.5 px-4 text-right">
              {{ formatPercent(asset.metrics.profitability.roe) }}
            </td>
            <td class="py-3.5 px-4 text-right">
              {{ formatPercent(asset.metrics.profitability.netMargin) }}
            </td>
            <td class="py-3.5 px-4 text-right">
              {{
                asset.metrics.leverage.debtToEquity
                  ? `${asset.metrics.leverage.debtToEquity.toFixed(1)}%`
                  : '—'
              }}
            </td>
            <td class="py-3.5 px-4 text-right">
              {{ formatNum(asset.metrics.leverage.currentRatio) }}
            </td>
            <td class="py-3.5 px-4 text-right rounded-r-lg">
              {{ formatPercent(asset.metrics.valuation.dividendYield) }}
            </td>
          </tr>

          <tr
            v-for="peer in asset.peers"
            :key="peer.symbol"
            class="hover:bg-neutral-50 dark:hover:bg-zinc-800/40 transition-all"
          >
            <th
              scope="row"
              class="py-3.5 px-4 text-left font-extrabold text-neutral-900 dark:text-white"
            >
              {{ peer.symbol.endsWith('.SA') ? peer.symbol.split('.')[0] : peer.symbol }}
            </th>
            <td class="py-3.5 px-4 text-neutral-500 dark:text-neutral-400">
              {{ peer.name }}
            </td>
            <td class="py-3.5 px-4 text-right font-semibold">
              {{ formatNum(peer.metrics.pe) }}
            </td>
            <td class="py-3.5 px-4 text-right font-semibold">
              {{ formatPercent(peer.metrics.roe) }}
            </td>
            <td class="py-3.5 px-4 text-right font-semibold">
              {{ formatPercent(peer.metrics.netMargin) }}
            </td>
            <td class="py-3.5 px-4 text-right font-semibold">
              {{ peer.metrics.debtToEquity ? `${peer.metrics.debtToEquity.toFixed(1)}%` : '—' }}
            </td>
            <td class="py-3.5 px-4 text-right font-semibold">
              {{ formatNum(peer.metrics.currentRatio) }}
            </td>
            <td class="py-3.5 px-4 text-right font-semibold">
              {{ formatPercent(peer.metrics.dividendYield) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-4 text-[10px] text-neutral-400 font-bold italic">
      * Highlights active queried asset. Valuation metrics derived from the multi-provider adapter
      layer.
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NormalizedAsset } from '../../../shared/types/domain';

defineProps<{
  asset: NormalizedAsset | null;
}>();

const formatNum = (val: number | null): string => {
  if (val === null) return '—';
  return val.toFixed(2);
};

const formatPercent = (val: number | null): string => {
  if (val === null) return '—';
  return `${(val * 100).toFixed(1)}%`;
};
</script>
