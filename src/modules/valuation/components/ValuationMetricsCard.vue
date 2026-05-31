<template>
  <div
    v-if="asset"
    class="rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6 transition-all duration-200"
  >
    <div class="border-b border-neutral-100 dark:border-neutral-800 pb-4">
      <h2 class="text-sm font-bold uppercase tracking-wider text-neutral-400">
        Valuation Multiples
      </h2>
      <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
        Key pricing and asset value ratios
      </p>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
      <div
        v-for="item in items"
        :key="item.label"
        class="p-4 rounded-lg bg-neutral-50 dark:bg-zinc-800/40 border border-neutral-100 dark:border-neutral-800/40 flex flex-col justify-between"
      >
        <div>
          <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">{{
            item.label
          }}</span>
          <span class="text-xs text-neutral-400 block mt-0.5 leading-relaxed">{{
            item.description
          }}</span>
        </div>
        <div class="mt-4 flex items-baseline justify-between">
          <span class="text-lg font-black text-neutral-900 dark:text-white">{{ item.value }}</span>
          <span
            v-if="item.status"
            class="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md"
            :class="
              item.status === 'Attractive'
                ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
                : item.status === 'Neutral'
                  ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
            "
          >
            {{ item.status }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { NormalizedAsset } from '../../../shared/types/domain';

const props = defineProps<{
  asset: NormalizedAsset | null;
}>();

const formatNum = (val: number | null, suffix = ''): string => {
  if (val === null || isNaN(val)) return '—';
  return val.toFixed(2) + suffix;
};

const items = computed(() => {
  if (!props.asset) return [];
  const v = props.asset.metrics.valuation;

  let peStatus = 'Neutral';
  if (v.pe !== null) {
    if (v.pe <= 15) peStatus = 'Attractive';
    else if (v.pe >= 30) peStatus = 'Premium';
  }

  let pegStatus = 'Neutral';
  if (v.pegRatio !== null) {
    if (v.pegRatio > 0 && v.pegRatio <= 1.2) pegStatus = 'Attractive';
    else if (v.pegRatio >= 2.5) pegStatus = 'Premium';
  }

  let pbStatus = 'Neutral';
  if (v.priceToBook !== null) {
    if (v.priceToBook <= 1.5) pbStatus = 'Attractive';
    else if (v.priceToBook >= 6.0) pbStatus = 'Premium';
  }

  return [
    {
      label: 'Trailing PE',
      description: 'Price to earnings ratio over last 12 months.',
      value: formatNum(v.pe),
      status: peStatus
    },
    {
      label: 'Forward PE',
      description: 'Estimated PE based on forward earning guidance.',
      value: formatNum(v.forwardPe),
      status: v.forwardPe && v.forwardPe < (v.pe || 999) ? 'Attractive' : 'Neutral'
    },
    {
      label: 'PEG Ratio',
      description: 'PE ratio divided by annual growth rate.',
      value: formatNum(v.pegRatio),
      status: pegStatus
    },
    {
      label: 'EV / EBITDA',
      description: 'Enterprise value to operating cash flow proxy.',
      value: formatNum(v.evToEbitda),
      status: v.evToEbitda && v.evToEbitda <= 12 ? 'Attractive' : 'Neutral'
    },
    {
      label: 'Price to Sales',
      description: 'Price paid per unit of top-line revenue.',
      value: formatNum(v.priceToSales),
      status: null
    },
    {
      label: 'Price to Book',
      description: 'Market cap compared to balance sheet net assets.',
      value: formatNum(v.priceToBook),
      status: pbStatus
    }
  ];
});
</script>
