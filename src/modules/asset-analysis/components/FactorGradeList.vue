<template>
  <div class="factor-list mt-6 space-y-3.5">
    <h3 class="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
      Factor Grades &amp; Ratings
    </h3>

    <div class="space-y-2">
      <button
        v-for="dim in dimensions"
        :key="dim.key"
        type="button"
        :aria-pressed="dim.key === activeKey ? 'true' : 'false'"
        class="factor-list__row w-full text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        :class="
          dim.key === activeKey
            ? 'bg-neutral-50/70 dark:bg-zinc-800/30 border-neutral-300 dark:border-zinc-700 shadow-sm'
            : 'bg-transparent border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50/50 dark:hover:bg-zinc-800/10'
        "
        @click="emit('select', dim.key)"
      >
        <div class="flex items-center gap-3">
          <span
            class="h-7 w-11 rounded flex items-center justify-center text-xs font-black tracking-tight"
            :class="dim.gradeClass"
          >
            {{ dim.grade }}
          </span>

          <div>
            <span class="text-xs font-bold text-neutral-900 dark:text-white block">{{
              dim.label
            }}</span>

            <span class="text-[10px] font-medium text-neutral-400">{{ dim.interpretation }}</span>
          </div>
        </div>

        <div class="flex items-center justify-between md:justify-end gap-5 shrink-0">
          <div class="text-right">
            <span class="text-xs font-bold text-neutral-900 dark:text-white">{{ dim.score }}</span>

            <span class="text-[10px] font-semibold text-neutral-400 block">Score / 100</span>
          </div>

          <div class="text-right min-w-[110px]">
            <span class="text-xs font-bold text-neutral-900 dark:text-white">{{
              dim.comparison
            }}</span>

            <span class="text-[10px] font-semibold text-neutral-400 block">vs Benchmark</span>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DimensionMeta } from '../composables/useFundamentalRating';

defineProps<{
  dimensions: DimensionMeta[];
  activeKey: string;
}>();

const emit = defineEmits<{
  select: [key: string];
}>();
</script>

<style scoped>
/* Rows lay out horizontally only when the card (not the viewport) is wide enough. */
.factor-list {
  container-type: inline-size;
}

@container (min-width: 30rem) {
  .factor-list__row {
    flex-direction: row;
    align-items: center;
  }
}
</style>
