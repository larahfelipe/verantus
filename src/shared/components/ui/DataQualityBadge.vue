<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
    :class="styles.cls"
    :title="styles.tooltip"
  >
    <span class="h-1.5 w-1.5 rounded-full" :class="styles.dot" />
    {{ styles.label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { DataConfidence } from '@/shared/types/domain';

const props = defineProps<{
  confidence: DataConfidence;
  /** Optional override for the visible label. */
  label?: string;
}>();

const styles = computed(() => {
  switch (props.confidence) {
    case 'live':
      return {
        label: props.label ?? 'Live data',
        cls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        dot: 'bg-emerald-500',
        tooltip: 'Sourced directly from the live data provider.'
      };
    case 'derived':
      return {
        label: props.label ?? 'Derived model',
        cls: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
        dot: 'bg-sky-500',
        tooltip:
          'Computed transparently from real upstream inputs (e.g. DCF from real free cash flow).'
      };
    default:
      return {
        label: props.label ?? 'Illustrative · demo',
        cls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        dot: 'bg-amber-500',
        tooltip: 'Demo content — NOT sourced from filings. Do not use for investment decisions.'
      };
  }
});
</script>
