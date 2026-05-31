<template>
  <div
    v-if="asset"
    class="rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6 transition-all duration-200"
  >
    <div class="border-b border-neutral-100 dark:border-neutral-800 pb-4">
      <h2 class="text-sm font-bold uppercase tracking-wider text-neutral-400">
        Condensed Financial Statements
      </h2>
      <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
        Rentabilidade, Margens, Liquidez, and capital structure details
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <div class="space-y-4">
        <h3
          class="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide border-b border-neutral-100 dark:border-neutral-800 pb-2"
        >
          Profitability & Return
        </h3>
        <div class="space-y-3">
          <div
            v-for="item in profitabilityItems"
            :key="item.label"
            class="flex justify-between items-center text-xs"
          >
            <span class="font-medium text-neutral-500 dark:text-neutral-400">{{ item.label }}</span>
            <span class="font-bold text-neutral-800 dark:text-neutral-200">{{ item.value }}</span>
          </div>
        </div>
      </div>
      <div class="space-y-4">
        <h3
          class="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide border-b border-neutral-100 dark:border-neutral-800 pb-2"
        >
          Liquidity & Cash Flows
        </h3>
        <div class="space-y-3">
          <div
            v-for="item in cashFlowItems"
            :key="item.label"
            class="flex justify-between items-center text-xs"
          >
            <span class="font-medium text-neutral-500 dark:text-neutral-400">{{ item.label }}</span>
            <span class="font-bold text-neutral-800 dark:text-neutral-200">{{ item.value }}</span>
          </div>
        </div>
      </div>
      <div class="space-y-4">
        <h3
          class="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide border-b border-neutral-100 dark:border-neutral-800 pb-2"
        >
          Capital Structure
        </h3>
        <div class="space-y-3">
          <div
            v-for="item in leverageItems"
            :key="item.label"
            class="flex justify-between items-center text-xs"
          >
            <span class="font-medium text-neutral-500 dark:text-neutral-400">{{ item.label }}</span>
            <span class="font-bold text-neutral-800 dark:text-neutral-200">{{ item.value }}</span>
          </div>
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

const formatPercent = (val: number | null): string => {
  if (val === null) return '—';
  return `${(val * 100).toFixed(1)}%`;
};

const formatNum = (val: number | null): string => {
  if (val === null) return '—';
  return val.toFixed(2);
};

const formatAmount = (val: number | null, currency: string): string => {
  if (val === null) return '—';
  const prefix = currency === 'BRL' ? 'R$' : '$';
  if (val >= 1e12) return `${prefix} ${(val / 1e12).toFixed(2)}T`;
  if (val >= 1e9) return `${prefix} ${(val / 1e9).toFixed(2)}B`;
  if (val >= 1e6) return `${prefix} ${(val / 1e6).toFixed(2)}M`;
  return prefix + ' ' + val.toLocaleString();
};

const profitabilityItems = computed(() => {
  if (!props.asset) return [];
  const p = props.asset.metrics.profitability;
  return [
    { label: 'Return on Equity (ROE)', value: formatPercent(p.roe) },
    { label: 'Return on Assets (ROA)', value: formatPercent(p.roa) },
    { label: 'Estimated ROIC', value: formatPercent(p.roic) },
    { label: 'Estimated CROIC', value: formatPercent(p.croic) },
    { label: 'Gross Profit Margin', value: formatPercent(p.grossMargin) },
    { label: 'Operating Margin', value: formatPercent(p.operatingMargin) },
    { label: 'Net Profit Margin', value: formatPercent(p.netMargin) }
  ];
});

const cashFlowItems = computed(() => {
  if (!props.asset) return [];
  const c = props.asset.metrics.cashFlow;
  const curr = props.asset.profile.currency;
  return [
    {
      label: 'Operating Cash Flow',
      value: formatAmount(c.operatingCashFlow, curr)
    },
    {
      label: 'Free Cash Flow (FCF)',
      value: formatAmount(c.freeCashFlow, curr)
    },
    { label: 'FCF Yield', value: formatPercent(c.fcfYield) },
    {
      label: 'Cash Conversion Ratio',
      value: formatPercent(c.cashConversionRatio)
    }
  ];
});

const leverageItems = computed(() => {
  if (!props.asset) return [];
  const l = props.asset.metrics.leverage;
  const curr = props.asset.profile.currency;
  return [
    { label: 'Total Cash', value: formatAmount(l.totalCash, curr) },
    { label: 'Total Debt', value: formatAmount(l.totalDebt, curr) },
    {
      label: 'Debt / Equity',
      value: l.debtToEquity ? `${l.debtToEquity.toFixed(1)}%` : '—'
    },
    { label: 'Current Ratio', value: formatNum(l.currentRatio) },
    { label: 'Quick Ratio', value: formatNum(l.quickRatio) }
  ];
});
</script>
