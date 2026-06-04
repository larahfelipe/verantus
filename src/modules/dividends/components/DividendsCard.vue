<template>
  <section
    v-if="asset"
    aria-labelledby="dividends-heading"
    class="rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6 transition-all duration-200"
  >
    <div
      class="border-b border-neutral-100 dark:border-neutral-800 pb-4 flex justify-between items-center"
    >
      <div>
        <h2
          id="dividends-heading"
          class="text-sm font-bold uppercase tracking-wider text-neutral-400"
        >
          Dividends & Distribution
        </h2>

        <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Yield, payout sustainability, and dates
        </p>
      </div>

      <span
        v-if="hasDividends"
        class="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md"
      >
        Paying Distribution
      </span>

      <span
        v-else
        class="text-[10px] font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 px-2 py-0.5 rounded-md"
      >
        Non-Dividend Paying
      </span>
    </div>

    <dl class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
      <div
        class="p-4 rounded-lg bg-neutral-50 dark:bg-zinc-800/40 border border-neutral-100 dark:border-neutral-800/40"
      >
        <dt class="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
          Dividend Yield
        </dt>

        <dd class="mt-2 text-xl font-black text-neutral-900 dark:text-white">
          {{ displayYield }}
        </dd>

        <span class="text-[10px] text-neutral-400 mt-1 block">Annualized yield on spot price.</span>
      </div>

      <div
        class="p-4 rounded-lg bg-neutral-50 dark:bg-zinc-800/40 border border-neutral-100 dark:border-neutral-800/40"
      >
        <dt class="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
          Payout Ratio
        </dt>

        <dd class="mt-2 text-xl font-black text-neutral-900 dark:text-white">
          {{ displayPayout }}
        </dd>

        <span class="text-[10px] text-neutral-400 mt-1 block"
          >Percentage of net income paid out.</span
        >
      </div>

      <div
        class="p-4 rounded-lg bg-neutral-50 dark:bg-zinc-800/40 border border-neutral-100 dark:border-neutral-800/40"
      >
        <dt class="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
          Dividend Growth
        </dt>

        <dd class="mt-2 text-xl font-black text-neutral-900 dark:text-white">
          {{ asset.metrics.dividends.dividendGrowth }}
        </dd>

        <span class="text-[10px] text-neutral-400 mt-1 block">Cash flows capacity for growth.</span>
      </div>

      <div
        class="p-4 rounded-lg bg-neutral-50 dark:bg-zinc-800/40 border border-neutral-100 dark:border-neutral-800/40"
      >
        <dt class="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
          Last / Ex-Date
        </dt>

        <dd class="mt-2 text-sm font-extrabold text-neutral-800 dark:text-neutral-200">
          {{ asset.metrics.dividends.exDividendDate }}
        </dd>

        <span class="text-[10px] text-neutral-400 mt-2 block">Latest registered payout date.</span>
      </div>
    </dl>

    <div
      v-if="hasDividends"
      class="mt-6 p-4 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-800/20 text-xs"
    >
      <div class="flex items-start gap-3">
        <span class="text-emerald-600 dark:text-emerald-400 font-bold"
          >ℹ Sustainability Analysis:</span
        >

        <span class="text-neutral-700 dark:text-neutral-300 leading-relaxed">
          The company pays a dividend yield of {{ displayYield }} supported by a payout ratio of
          {{ displayPayout }}.
          <span v-if="payoutUnderThreshold">
            A payout below {{ sustainablePayoutLabel }} indicates that the dividend is well-covered
            by earnings, leaving substantial cash for reinvestment and buffer.
          </span>

          <span v-else>
            A payout exceeding {{ sustainablePayoutLabel }} indicates that a large portion of
            earnings is returned to shareholders, which might limit high-velocity growth
            reinvestment.
          </span>
        </span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { NormalizedAsset } from '@/shared/types/domain';

const props = defineProps<{
  asset: NormalizedAsset | null;
}>();

/** Payout below this fraction of earnings is considered comfortably covered. */
const SUSTAINABLE_PAYOUT_RATIO = 0.6;
const sustainablePayoutLabel = `${SUSTAINABLE_PAYOUT_RATIO * 100}%`;

const hasDividends = computed(() => {
  const y = props.asset?.metrics.dividends.dividendYield;
  return y !== null && y !== undefined && y > 0;
});

const displayYield = computed(() => {
  const y = props.asset?.metrics.dividends.dividendYield;
  if (y === null || y === undefined) return '0.00%';
  return `${(y * 100).toFixed(2)}%`;
});

const displayPayout = computed(() => {
  const p = props.asset?.metrics.dividends.payoutRatio;
  if (p === null || p === undefined) return '—';
  return `${(p * 100).toFixed(1)}%`;
});

const payoutUnderThreshold = computed(() => {
  const p = props.asset?.metrics.dividends.payoutRatio;
  return p !== null && p !== undefined && p < SUSTAINABLE_PAYOUT_RATIO;
});
</script>
