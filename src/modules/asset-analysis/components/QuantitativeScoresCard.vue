<template>
  <div
    v-if="asset"
    class="rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6 transition-all duration-200"
  >
    <div
      class="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4"
    >
      <div>
        <h2 class="text-sm font-bold uppercase tracking-wider text-neutral-400">
          Quantitative Rating
        </h2>
        <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Multi-factor rating breakdown and audit metrics
        </p>
      </div>
      <div class="flex items-center gap-3">
        <div class="text-right">
          <div class="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            {{ asset.scores.consolidated
            }}<span class="text-xs text-neutral-400 font-semibold">/100</span>
          </div>
          <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400"
            >Consolidated</span
          >
        </div>
        <div
          class="h-12 w-12 rounded-xl flex items-center justify-center text-lg font-black shadow-inner"
          :class="badgeColorClass"
        >
          {{ gradeLabel }}
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div class="space-y-4">
        <h3
          class="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide"
        >
          Dimension Performance
        </h3>

        <div
          v-for="(val, key) in dimensions"
          :key="key"
          class="space-y-1.5 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-zinc-800/30 transition-all"
        >
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold capitalize text-neutral-700 dark:text-neutral-300">{{
              key.replace(/([A-Z])/g, ' $1')
            }}</span>
            <div class="flex items-center gap-2">
              <span class="font-extrabold text-neutral-900 dark:text-white"
                >{{ val?.score || 0 }}%</span
              >
              <button
                type="button"
                class="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline"
                :aria-expanded="activeAuditKey === key ? 'true' : 'false'"
                aria-controls="methodology-panel"
                @click="toggleActiveAudit(key)"
              >
                {{ activeAuditKey === key ? 'Hide Audit' : 'Audit Logs' }}
              </button>
            </div>
          </div>
          <div
            class="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden"
            role="progressbar"
            :aria-valuenow="val?.score || 0"
            aria-valmin="0"
            aria-valmax="100"
            :aria-label="key.replace(/([A-Z])/g, ' $1') + ' performance score'"
          >
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="barColorClass(val?.score || 0)"
              :style="{ width: (val?.score || 0) + '%' }"
            />
          </div>
        </div>
      </div>

      <div
        id="methodology-panel"
        class="rounded-lg bg-neutral-50 dark:bg-zinc-800/40 p-5 border border-neutral-100 dark:border-neutral-800 flex flex-col justify-between"
      >
        <div>
          <div
            class="flex items-center justify-between pb-3 border-b border-neutral-200/50 dark:border-neutral-700/50"
          >
            <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Methodology & Logs
            </h4>
            <span
              class="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase"
              :class="
                activeAuditKey
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
              "
            >
              {{ activeAuditKey ? activeAuditKey.replace(/([A-Z])/g, ' $1') : 'Select Dimension' }}
            </span>
          </div>

          <div v-if="activeAudit" class="mt-4 space-y-4">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400"
                >Evaluation Method</span
              >
              <p class="text-xs font-medium text-neutral-700 dark:text-neutral-300 mt-1 italic">
                {{ activeAudit.methodology }}
              </p>
            </div>

            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400"
                >System Logs</span
              >
              <div class="mt-2 space-y-2 max-h-[160px] overflow-y-auto pr-1">
                <div
                  v-for="(log, idx) in activeAudit.details"
                  :key="idx"
                  class="flex items-start gap-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400"
                >
                  <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  <span>{{ log }}</span>
                </div>
                <div
                  v-if="activeAudit.details.length === 0"
                  class="text-xs text-neutral-500 italic"
                >
                  No logs generated for this dimension.
                </div>
              </div>
            </div>
          </div>

          <div v-else class="h-48 flex flex-col items-center justify-center text-center">
            <svg
              class="w-8 h-8 text-neutral-300 dark:text-neutral-700 mb-2"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p class="text-xs text-neutral-400 font-medium">
              Click "Audit Logs" to view quantitative scoring formulas and metrics calculation
              audits.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

import type { NormalizedAsset, ScoreComponent } from '../../../shared/types/domain';

const props = defineProps<{
  asset: NormalizedAsset | null;
}>();

const activeAuditKey = ref<string>('businessQuality');

const dimensions = computed(() => {
  if (!props.asset) return {};
  return {
    businessQuality: props.asset.scores.businessQuality,
    growth: props.asset.scores.growth,
    financialHealth: props.asset.scores.financialHealth,
    valuation: props.asset.scores.valuation,
    efficiency: props.asset.scores.efficiency
  };
});

watch(
  () => props.asset,
  () => {
    activeAuditKey.value = 'businessQuality';
  },
  { deep: true }
);

const activeAudit = computed<ScoreComponent | null>(() => {
  if (!props.asset || !activeAuditKey.value) return null;
  const key = activeAuditKey.value as Exclude<keyof typeof props.asset.scores, 'consolidated'>;
  return props.asset.scores[key] || null;
});

const toggleActiveAudit = (key: string) => {
  if (activeAuditKey.value === key) {
    activeAuditKey.value = '';
  } else {
    activeAuditKey.value = key;
  }
};

const gradeLabel = computed(() => {
  const sc = props.asset?.scores.consolidated || 50;
  if (sc >= 75) return 'A';
  if (sc >= 60) return 'B';
  if (sc >= 45) return 'C';
  return 'D';
});

const badgeColorClass = computed(() => {
  const sc = props.asset?.scores.consolidated || 50;
  if (sc >= 75) return 'bg-teal-500/10 text-teal-600 dark:text-teal-400';
  if (sc >= 60) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
  if (sc >= 45) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
  return 'bg-rose-500/10 text-rose-600 dark:text-rose-400';
});

const barColorClass = (score: number): string => {
  if (score >= 70) return 'bg-teal-500 dark:bg-teal-400';
  if (score >= 45) return 'bg-emerald-500 dark:bg-emerald-400';
  return 'bg-rose-500 dark:bg-rose-400';
};
</script>
