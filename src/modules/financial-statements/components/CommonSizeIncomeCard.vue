<template>
  <section
    v-if="asset && years.length"
    aria-labelledby="net-margin-trend-heading"
    class="rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6 transition-all duration-200"
  >
    <div
      class="border-b border-neutral-100 dark:border-neutral-800 pb-4 flex items-start justify-between gap-4"
    >
      <div>
        <h2
          id="net-margin-trend-heading"
          class="text-sm font-bold uppercase tracking-wider text-neutral-400"
        >
          Net Margin Trend
        </h2>

        <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Net income as a percentage of revenue. This source does not report gross profit or
          operating income, so those margins are omitted rather than shown as zero.
        </p>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <span
          class="px-2 py-0.5 rounded text-[10px] uppercase font-bold"
          :class="trendChipClass(netMarginTrend)"
        >
          {{ netMarginTrend }}
        </span>

        <DataQualityBadge :confidence="asset.provenance.incomeAnalysis" />
      </div>
    </div>

    <div class="mt-6 overflow-x-auto">
      <table class="w-full text-xs border-collapse">
        <thead>
          <tr class="border-b border-neutral-100 dark:border-neutral-800">
            <th
              scope="col"
              class="text-left font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide py-2 pr-4"
            >
              Line
            </th>

            <th
              v-for="y in years"
              :key="y.year"
              scope="col"
              class="text-right font-bold text-neutral-500 dark:text-neutral-400 py-2 px-3 tabular-nums"
            >
              {{ y.year }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="row in rows"
            :key="row.label"
            class="border-b border-neutral-50 dark:border-neutral-800/50"
          >
            <th
              scope="row"
              class="text-left font-medium text-neutral-500 dark:text-neutral-400 py-2 pr-4 whitespace-nowrap"
            >
              {{ row.label }}
            </th>

            <td
              v-for="(value, index) in row.values"
              :key="index"
              class="text-right font-bold text-neutral-800 dark:text-neutral-200 py-2 px-3"
            >
              <DataPoint :value="value" :format="row.format" :currency="asset.profile.currency" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import DataPoint from '@/shared/components/ui/DataPoint.vue';
import DataQualityBadge from '@/shared/components/ui/DataQualityBadge.vue';
import type { MetricTrend, NormalizedAsset } from '@/shared/types/domain';

const props = defineProps<{
  asset: NormalizedAsset | null;
}>();

const years = computed(() => props.asset?.incomeAnalysis.years ?? []);
const netMarginTrend = computed<MetricTrend>(
  () => props.asset?.incomeAnalysis.netMarginTrend ?? 'stable'
);

const rows = computed(() => {
  const ys = years.value;
  return [
    { label: 'Revenue', format: 'money' as const, values: ys.map((y) => y.revenue) },
    { label: 'Net Income', format: 'money' as const, values: ys.map((y) => y.netIncome) },
    { label: 'Net Margin', format: 'percent' as const, values: ys.map((y) => y.netMargin) }
  ];
});

const trendChipClass = (trend: MetricTrend): string => {
  if (trend === 'improving') {
    return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20';
  }
  if (trend === 'deteriorating') {
    return 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/20';
  }
  return 'text-neutral-500 bg-neutral-100 dark:text-neutral-400 dark:bg-zinc-800/40';
};
</script>
