<template>
  <div :class="statisticsCardStyles">
    <span>{{ title }}</span>

    <div class="statistics-card-content-wrapper">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { StatisticsCardProps } from '@/types';

export default defineComponent({
  name: 'StatisticsCard',
  props: {
    title: {
      type: String,
      required: true
    }
  } as StatisticsCardProps,
  computed: {
    theme() {
      return this.$store.getters['theme/currentTheme'];
    },
    statisticsCardStyles() {
      return this.theme === 'dark'
        ? 'statistics-card-wrapper statistics-card-wrapper-dark'
        : 'statistics-card-wrapper';
    }
  }
});
</script>

<style scoped>
.statistics-card-wrapper {
  width: 12.5rem;

  min-width: 12rem;

  display: flex;
  flex-direction: column;

  padding: 1.2rem;

  border: 1px solid #ddd;
  border-radius: 10px;

  cursor: default;

  background-color: #ebedf3;

  transition: all 0.2s ease;
}
.statistics-card-wrapper:hover,
.statistics-card-wrapper-dark:hover {
  border-color: #01c261;
}

.statistics-card-wrapper:hover {
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}

.statistics-card-wrapper-dark:hover {
  box-shadow: rgba(74, 77, 77, 0.2) 0px 8px 24px;
}

.statistics-card-wrapper-dark {
  border: 1px solid #333;

  color: #c4c4c5;

  background-color: #202229;
}

.statistics-card-wrapper span {
  font-size: 16px;
  font-weight: 600;
}

.statistics-card-content-wrapper {
  margin-top: 0.5rem;
  margin-left: 1.2rem;

  font-size: 24px;
}

@media (max-width: 1550px) {
  .statistics-card-wrapper {
    width: 11.5rem;
  }
  .statistics-card-wrapper h6 {
    margin-left: unset;

    font-size: 14px;
  }
  .statistics-card-content-wrapper {
    margin-left: unset;
  }
}
@media (max-width: 1190px) {
  .statistics-card-wrapper {
    width: 13rem;
  }
  .statistics-card-content-wrapper {
    margin-left: 1rem;
  }
}
@media (max-width: 1045px) {
  .statistics-card-wrapper {
    width: 11rem;
  }
  .statistics-card-content-wrapper {
    margin-left: 0.5rem;
  }
}
</style>
