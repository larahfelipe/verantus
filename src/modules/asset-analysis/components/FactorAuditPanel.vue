<template>
  <div
    class="mt-6 border border-neutral-200/70 dark:border-neutral-800 rounded-xl p-4 bg-neutral-50/20 dark:bg-zinc-900/40"
  >
    <div
      class="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800"
    >
      <div class="flex gap-1.5">
        <button
          v-for="tab in DETAIL_TABS"
          :key="tab.value"
          type="button"
          class="px-3 py-1.5 text-xs font-bold uppercase rounded-lg transition-colors border"
          :class="
            activeTab === tab.value
              ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-950 dark:border-white shadow-sm'
              : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 border-transparent'
          "
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>

      <span
        class="px-2.5 py-0.5 rounded border border-emerald-500/10 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wide shrink-0 ml-2"
      >
        {{ dimensionName }}
      </span>
    </div>

    <div class="mt-4 min-h-[180px]">
      <div v-if="activeTab === 'breakdown'" class="space-y-2.5">
        <p class="text-[10px] text-neutral-400 leading-snug">
          Points are shown relative to a neutral baseline: <span class="font-bold">0</span> means in
          line with the benchmark, positive values reward outperformance and negative values
          penalise underperformance, up to ± the metric weight.
        </p>

        <div v-if="audit?.breakdown?.length" class="space-y-2.5">
          <div
            v-for="item in audit.breakdown"
            :key="item.name"
            class="p-2.5 rounded-lg border border-neutral-100 dark:border-neutral-800/80 bg-white dark:bg-zinc-900 flex flex-col gap-1.5"
          >
            <div class="flex justify-between items-start text-xs font-semibold">
              <div class="min-w-0">
                <span class="text-neutral-950 dark:text-white font-bold truncate block">{{
                  item.name
                }}</span>

                <span class="text-[9px] text-neutral-400 font-medium mt-0.5 block">
                  Weight: {{ item.weight }}% • Benchmark: {{ item.benchmark }}
                </span>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <span class="font-extrabold text-neutral-950 dark:text-white">{{
                  item.value
                }}</span>

                <span
                  class="px-1.5 py-0.5 rounded text-[9px] font-black shrink-0"
                  :class="
                    item.points >= 0
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  "
                >
                  {{ item.points >= 0 ? '+' : '' }}{{ item.points }}
                </span>
              </div>
            </div>

            <div class="h-1 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-300"
                :class="item.points >= 0 ? 'bg-emerald-500' : 'bg-rose-500'"
                :style="{ width: barWidth(item.points, item.maxPoints) }"
              />
            </div>
          </div>
        </div>

        <div v-else class="text-xs text-neutral-400 italic py-4 text-center">
          No breakdown details available.
        </div>
      </div>

      <div
        v-if="activeTab === 'methodology'"
        class="space-y-4 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400"
      >
        <div>
          <span class="text-[9px] font-black uppercase text-neutral-400 tracking-wider block mb-1"
            >Evaluation Framework</span
          >

          <p class="font-semibold text-neutral-800 dark:text-neutral-200">
            {{ audit?.methodology }}
          </p>
        </div>

        <div class="pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <span class="text-[9px] font-black uppercase text-neutral-400 tracking-wider block mb-2"
            >Metric Weightings</span
          >

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div
              v-for="item in audit?.breakdown"
              :key="item.name"
              class="flex justify-between items-center text-[10px] font-semibold"
            >
              <span class="text-neutral-500 truncate max-w-[140px]">{{ item.name }}</span>

              <span
                class="text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded font-black"
                >{{ item.weight }}%</span
              >
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'auditTrail'" class="space-y-2.5">
        <span class="text-[9px] font-black uppercase text-neutral-400 tracking-wider block mb-1.5"
          >Key Findings &amp; Audits</span
        >

        <div class="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          <div
            v-for="(item, idx) in auditTrail"
            :key="idx"
            class="flex items-start gap-2.5 text-xs font-semibold leading-normal"
          >
            <span
              class="mt-0.5 shrink-0 select-none font-bold"
              :class="item.isPositive ? 'text-emerald-500' : 'text-amber-500'"
            >
              {{ item.isPositive ? '✓' : '⚠' }}
            </span>

            <span class="text-neutral-800 dark:text-neutral-200">{{ item.text }}</span>
          </div>

          <div v-if="!auditTrail.length" class="text-xs text-neutral-400 italic py-4 text-center">
            No logs generated for this dimension.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import type { ScoreComponent } from '@/shared/types/domain';

import type { AuditTrailItem } from '../composables/useFundamentalRating';

defineProps<{
  audit: ScoreComponent | null;
  auditTrail: AuditTrailItem[];
  dimensionName: string;
}>();

type DetailTab = 'breakdown' | 'auditTrail' | 'methodology';

const DETAIL_TABS: ReadonlyArray<{ label: string; value: DetailTab }> = [
  { label: 'Breakdown', value: 'breakdown' },
  { label: 'Audit Trail', value: 'auditTrail' },
  { label: 'Methodology', value: 'methodology' }
];

const activeTab = ref<DetailTab>('breakdown');

/** Centres the bar at 50% (neutral) and scales ± points toward the metric's weight. */
const MIN_BAR_PERCENT = 5;
const MAX_BAR_PERCENT = 100;
const NEUTRAL_BAR_PERCENT = 50;

const barWidth = (points: number, maxPoints: number): string => {
  const ratio =
    maxPoints > 0 ? (points / maxPoints + 1) * NEUTRAL_BAR_PERCENT : NEUTRAL_BAR_PERCENT;
  return `${Math.max(MIN_BAR_PERCENT, Math.min(MAX_BAR_PERCENT, ratio))}%`;
};
</script>
