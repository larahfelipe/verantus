<template>
  <div class="statistics-item-wrapper">
    <span>
      {{ label }}
      <span class="statistics-item-abbreviation">{{ labelAbbreviation }}</span>
    </span>
    <strong>{{ parsedValue }}</strong>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { StatisticsItemProps } from '@/types';

export default defineComponent({
  name: 'StatisticsItem',
  props: {
    label: {
      type: String,
      required: true
    },
    labelAbbreviation: {
      type: String,
      required: false,
      default: ''
    },
    value: {
      type: String,
      required: true
    }
  } as StatisticsItemProps,
  computed: {
    parsedValue() {
      return this.value ? this.value : 'N/A';
    }
  }
});
</script>

<style scoped>
.statistics-item-wrapper {
  display: flex;
  justify-content: space-between;

  border-bottom: 1px solid #ebedf3;

  padding: 0 0.5rem;

  line-height: 30px;
}

.statistics-item-abbreviation {
  color: #9b9b9b;
}
</style>
