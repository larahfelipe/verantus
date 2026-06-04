<template>
  <section
    v-if="asset"
    aria-labelledby="fundamental-rating-heading"
    class="rating-card rounded-xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-6 transition-all duration-200"
  >
    <div
      class="rating-card__header flex justify-between gap-6 pb-6 border-b border-neutral-200/60 dark:border-neutral-800"
    >
      <div class="flex items-start gap-5">
        <div
          class="h-20 w-20 shrink-0 rounded-2xl flex flex-col items-center justify-center border font-black text-3xl shadow-sm tracking-tighter"
          :class="gradeBadgeClass"
        >
          <span class="text-[9px] uppercase tracking-widest font-bold opacity-60"> Rating </span>
          {{ gradeLabel }}
        </div>

        <div class="space-y-1.5">
          <h2
            id="fundamental-rating-heading"
            class="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500"
          >
            Fundamental Rating
          </h2>

          <div class="flex items-baseline gap-2">
            <span class="text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              {{ consolidatedScore }}
            </span>

            <span class="text-sm text-neutral-400 dark:text-neutral-500 font-semibold">/ 100</span>
          </div>

          <div class="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span class="text-neutral-900 dark:text-white">{{ assessment }}</span>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap gap-2.5 items-center">
        <div
          class="px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-zinc-800/30 border border-neutral-100 dark:border-neutral-800 flex flex-col gap-0.5"
        >
          <span class="text-[9px] uppercase font-bold text-neutral-400 tracking-wider"
            >Grade Scale</span
          >

          <span class="text-xs font-bold text-neutral-900 dark:text-white">
            A ≥ 80 · B ≥ 65 · C ≥ 50 · D &lt; 50
          </span>

          <span class="text-[9px] font-bold text-neutral-400"
            >Weighted across 5 fundamental factors</span
          >
        </div>
      </div>
    </div>

    <div class="py-5 border-b border-neutral-200/60 dark:border-neutral-800">
      <h3
        class="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2"
      >
        Analyst Executive Summary
      </h3>

      <p class="text-sm font-semibold text-neutral-800 dark:text-neutral-200 leading-relaxed">
        "{{ executiveSummary }}"
      </p>
    </div>

    <div class="py-5 border-b border-neutral-200/60 dark:border-neutral-800">
      <div class="flex flex-col justify-between">
        <div>
          <h3
            class="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500"
          >
            Fundamental Health Index
          </h3>

          <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Combined core strength metric (excludes valuation price levels)
          </p>
        </div>

        <div class="flex items-center gap-3 mt-3">
          <div class="shrink-0 min-w-[55px]">
            <span class="text-2xl font-black text-neutral-900 dark:text-white">{{
              fundamentalHealthScore
            }}</span>

            <span class="text-xs text-neutral-400 font-semibold">/100</span>
          </div>

          <div
            class="h-2 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden"
            role="progressbar"
            :aria-valuenow="fundamentalHealthScore"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label="Fundamental health index"
          >
            <div
              class="h-full rounded-full transition-all duration-300"
              :class="healthBarColor"
              :style="{ width: fundamentalHealthScore + '%' }"
            />
          </div>
        </div>
      </div>
    </div>

    <FactorGradeList
      :dimensions="dimensions"
      :active-key="activeAuditKey"
      @select="activeAuditKey = $event"
    />

    <div class="rating-card__split grid grid-cols-1 gap-6 mt-6">
      <div class="space-y-3">
        <h3
          class="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500"
        >
          Rating Score Drivers
        </h3>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-neutral-100 dark:border-neutral-800 rounded-xl p-4 bg-neutral-50/50 dark:bg-zinc-800/10"
        >
          <div>
            <span
              class="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider block mb-2"
              >Positive Catalysts</span
            >

            <ul class="space-y-1.5">
              <li
                v-for="driver in scoreDrivers.positive"
                :key="driver"
                class="flex items-start gap-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200"
              >
                <span class="text-emerald-500 select-none font-bold">✓</span>

                <span>{{ driver }}</span>
              </li>

              <li v-if="scoreDrivers.positive.length === 0" class="text-xs text-neutral-400 italic">
                No key positive drivers found.
              </li>
            </ul>
          </div>

          <div>
            <span
              class="text-[9px] font-black uppercase text-amber-600 dark:text-amber-500 tracking-wider block mb-2"
              >Risk Factors &amp; Headwinds</span
            >

            <ul class="space-y-1.5">
              <li
                v-for="driver in scoreDrivers.negative"
                :key="driver"
                class="flex items-start gap-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200"
              >
                <span class="text-amber-500 select-none font-bold">⚠</span>

                <span>{{ driver }}</span>
              </li>

              <li v-if="scoreDrivers.negative.length === 0" class="text-xs text-neutral-400 italic">
                No risk headwinds detected.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="space-y-3">
        <h3
          class="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500"
        >
          Company vs Benchmark
        </h3>

        <div class="border border-neutral-100 dark:border-neutral-800 rounded-xl overflow-hidden">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr
                class="bg-neutral-50 dark:bg-zinc-800/30 text-[9px] font-bold text-neutral-400 uppercase tracking-wider"
              >
                <th class="py-2.5 px-4">Key Metric</th>

                <th class="py-2.5 px-4 text-right">Company</th>

                <th class="py-2.5 px-4 text-right">Benchmark</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              <tr
                v-for="item in benchmarkComparisons"
                :key="item.name"
                class="text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50/30 dark:hover:bg-zinc-800/5"
              >
                <td class="py-2 px-4">{{ item.name }}</td>

                <td class="py-2 px-4 text-right text-neutral-900 dark:text-white">
                  {{ item.value }}
                </td>

                <td class="py-2 px-4 text-right text-neutral-400">
                  {{ item.benchmark }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <FactorAuditPanel
      :audit="activeAudit"
      :audit-trail="auditTrailItems"
      :dimension-name="selectedDimensionName"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import type { NormalizedAsset, ScoreComponent } from '@/shared/types/domain';

import { buildAuditTrail, useFundamentalRating } from '../composables/useFundamentalRating';
import FactorAuditPanel from './FactorAuditPanel.vue';
import FactorGradeList from './FactorGradeList.vue';

const props = defineProps<{
  asset: NormalizedAsset | null;
}>();

const {
  consolidatedScore,
  gradeLabel,
  gradeBadgeClass,
  assessment,
  executiveSummary,
  fundamentalHealthScore,
  healthBarColor,
  dimensions,
  scoreDrivers,
  benchmarkComparisons
} = useFundamentalRating(() => props.asset);

type FactorScoreKey = Exclude<keyof NormalizedAsset['scores'], 'consolidated'>;
const DEFAULT_FACTOR: FactorScoreKey = 'businessQuality';

const activeAuditKey = ref<string>(DEFAULT_FACTOR);

watch(
  () => props.asset,
  () => {
    activeAuditKey.value = DEFAULT_FACTOR;
  }
);

const activeAudit = computed<ScoreComponent | null>(() => {
  const scores = props.asset?.scores;
  if (!scores) return null;
  return scores[activeAuditKey.value as FactorScoreKey] ?? null;
});

const auditTrailItems = computed(() => buildAuditTrail(activeAudit.value));

const selectedDimensionName = computed(() => {
  const spaced = activeAuditKey.value.replace(/([A-Z])/g, ' $1');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
});
</script>

<style scoped>
/*
 * On xl screens this card sits in a column capped at 600px, so its internal
 * layout must respond to its own width — not the viewport. Container queries
 * keep tight regions stacked until the card itself is wide enough, instead of
 * laying them out horizontally exactly when the card is at its narrowest.
 */
.rating-card {
  container-type: inline-size;
}

.rating-card__header {
  flex-direction: column;
}

.rating-card__split {
  grid-template-columns: minmax(0, 1fr);
}

@container (min-width: 40rem) {
  .rating-card__header {
    flex-direction: row;
    align-items: center;
  }

  .rating-card__split {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
