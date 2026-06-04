<template>
  <section
    v-if="asset"
    aria-labelledby="valuation-multiples-heading"
    class="rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6 transition-all duration-200"
  >
    <div class="border-b border-neutral-100 dark:border-neutral-800 pb-4">
      <h2
        id="valuation-multiples-heading"
        class="text-sm font-bold uppercase tracking-wider text-neutral-400"
      >
        Valuation Multiples
      </h2>

      <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
        Key pricing and asset value ratios
      </p>
    </div>

    <dl class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-2 gap-4 mt-6">
      <div
        v-for="item in items"
        :key="item.label"
        class="p-4 rounded-lg bg-neutral-50 dark:bg-zinc-800/40 border border-neutral-100 dark:border-neutral-800/40 flex flex-col justify-between"
      >
        <dt>
          <span
            class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between"
          >
            {{ item.label }}
            <InfoTooltip
              v-if="item.tooltipKey && METRIC_TOOLTIPS[item.tooltipKey]"
              v-bind="METRIC_TOOLTIPS[item.tooltipKey]"
            />
          </span>

          <span class="text-xs text-neutral-400 block mt-0.5 leading-relaxed">{{
            item.description
          }}</span>
        </dt>

        <dd class="mt-4 flex items-center justify-between gap-2">
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
        </dd>
      </div>
    </dl>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import InfoTooltip from '@/shared/components/ui/InfoTooltip.vue';
import { METRIC_TOOLTIPS } from '@/shared/constants/tooltips';
import type { NormalizedAsset } from '@/shared/types/domain';

const props = defineProps<{
  asset: NormalizedAsset | null;
}>();

/**
 * Presentational valuation thresholds. These are intentionally absolute (not
 * sector-relative): the sector-aware scoring lives in the scoring engine; here
 * we only label a multiple as cheap/rich for a quick at-a-glance signal.
 */
const ATTRACTIVE_PE = 15;
const PREMIUM_PE = 30;
const ATTRACTIVE_PEG = 1.2;
const PREMIUM_PEG = 2.5;
const ATTRACTIVE_PRICE_TO_BOOK = 1.5;
const PREMIUM_PRICE_TO_BOOK = 6;
const ATTRACTIVE_EV_TO_EBITDA = 12;

type ValuationStatus = 'Attractive' | 'Neutral' | 'Premium';

interface ValuationItem {
  label: string;
  description: string;
  value: string;
  status: ValuationStatus | null;
  tooltipKey: string;
}

const formatNum = (val: number | null, suffix = ''): string => {
  if (val === null || isNaN(val)) return '—';
  return val.toFixed(2) + suffix;
};

const bandStatus = (
  value: number | null,
  attractiveAtOrBelow: number,
  premiumAtOrAbove: number
): ValuationStatus => {
  if (value === null) return 'Neutral';
  if (value <= attractiveAtOrBelow) return 'Attractive';
  if (value >= premiumAtOrAbove) return 'Premium';
  return 'Neutral';
};

const items = computed<ValuationItem[]>(() => {
  if (!props.asset) return [];
  const v = props.asset.metrics.valuation;

  const pegStatus: ValuationStatus =
    v.pegRatio !== null && v.pegRatio > 0
      ? bandStatus(v.pegRatio, ATTRACTIVE_PEG, PREMIUM_PEG)
      : 'Neutral';

  const forwardCheaperThanTrailing = v.forwardPe !== null && (v.pe === null || v.forwardPe < v.pe);

  const evToEbitdaAttractive = v.evToEbitda !== null && v.evToEbitda <= ATTRACTIVE_EV_TO_EBITDA;

  return [
    {
      label: 'Trailing PE',
      description: 'Price to earnings ratio over last 12 months.',
      value: formatNum(v.pe),
      status: bandStatus(v.pe, ATTRACTIVE_PE, PREMIUM_PE),
      tooltipKey: 'pe'
    },
    {
      label: 'Forward PE',
      description: 'Estimated PE based on forward earning guidance.',
      value: formatNum(v.forwardPe),
      status: forwardCheaperThanTrailing ? 'Attractive' : 'Neutral',
      tooltipKey: 'forwardPe'
    },
    {
      label: 'PEG Ratio',
      description: 'PE ratio divided by annual growth rate.',
      value: formatNum(v.pegRatio),
      status: pegStatus,
      tooltipKey: 'pegRatio'
    },
    {
      label: 'EV / EBITDA',
      description: 'Enterprise value to operating cash flow proxy.',
      value: formatNum(v.evToEbitda),
      status: evToEbitdaAttractive ? 'Attractive' : 'Neutral',
      tooltipKey: 'evToEbitda'
    },
    {
      label: 'Price to Sales',
      description: 'Price paid per unit of top-line revenue.',
      value: formatNum(v.priceToSales),
      status: null,
      tooltipKey: 'priceToSales'
    },
    {
      label: 'Price to Book',
      description: 'Market cap compared to book equity.',
      value: formatNum(v.priceToBook),
      status: bandStatus(v.priceToBook, ATTRACTIVE_PRICE_TO_BOOK, PREMIUM_PRICE_TO_BOOK),
      tooltipKey: 'priceToBook'
    }
  ];
});
</script>
