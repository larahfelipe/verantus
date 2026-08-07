<template>
  <span class="tabular-nums" :class="emphasisClass">{{ display }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { formatCompactMoney } from '@/shared/utils/formatMoney';
import { formatPercent, formatSignedPercent } from '@/shared/utils/formatPercent';

type DataPointFormat = 'text' | 'number' | 'ratio' | 'percent' | 'signedPercent' | 'money';
type DataPointEmphasis = 'normal' | 'strong' | 'muted';

const props = withDefaults(
  defineProps<{
    value: number | string | null | undefined;
    format?: DataPointFormat;
    currency?: string;
    fractionDigits?: number;
    placeholder?: string;
    emphasis?: DataPointEmphasis;
  }>(),
  {
    format: 'text',
    currency: 'USD',
    fractionDigits: 2,
    placeholder: '—',
    emphasis: 'normal'
  }
);

/**
 * The single gate for rendering a value: anything absent — null, undefined or a
 * non-finite number — becomes the placeholder, so no component can print a
 * fabricated 0 or NaN in place of missing data.
 */
const isMissing = computed(
  () =>
    props.value === null ||
    props.value === undefined ||
    (typeof props.value === 'number' && !Number.isFinite(props.value))
);

const display = computed(() => {
  if (isMissing.value) return props.placeholder;
  const value = props.value;

  if (typeof value === 'number') {
    switch (props.format) {
      case 'percent':
        return formatPercent(value);
      case 'signedPercent':
        return formatSignedPercent(value);
      case 'money':
        return formatCompactMoney(value, props.currency);
      case 'ratio':
        return value.toFixed(props.fractionDigits);
      case 'number':
        return value.toLocaleString('en-US');
      default:
        return String(value);
    }
  }

  return String(value);
});

const emphasisClass = computed(() => {
  if (props.emphasis === 'strong') return 'font-bold text-neutral-900 dark:text-white';
  if (props.emphasis === 'muted') return 'text-neutral-400';
  return '';
});
</script>
