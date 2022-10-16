<template>
  <div :class="statisticsItemStyles">
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
    theme() {
      return this.$store.getters['theme/currentTheme'];
    },
    statisticsItemStyles() {
      return this.theme === 'dark'
        ? 'statistics-item-wrapper statistics-item-wrapper__dark'
        : 'statistics-item-wrapper';
    },
    parsedValue() {
      return this.value ? this.value : '-';
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

.statistics-item-wrapper__dark {
  border-bottom: 1px solid #353535;
}

.statistics-item-abbreviation {
  color: #9b9b9b;
}

.statistics-item-wrapper__dark .statistics-item-abbreviation {
  color: #6b6b6b;
}
</style>
