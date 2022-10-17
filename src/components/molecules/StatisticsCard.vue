<template>
  <div :class="statisticsCardStyles">
    <div>
      <h6>{{ title }}</h6>
    </div>

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
  width: 15rem;
  height: 7.25rem;

  min-width: 10rem;
  min-height: 7rem;

  display: flex;
  flex-direction: column;

  padding: 1rem;

  border: 1px solid #ddd;
  border-radius: 8px;

  cursor: default;

  background-color: #ebedf3;

  transition: all 0.2s ease;
}

.statistics-card-wrapper:hover,
.statistics-card-wrapper-dark:hover {
  transform: translateY(-0.25rem);
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

.statistics-card-wrapper h6 {
  margin-left: 0.75rem;

  font-weight: 600;
}

.statistics-card-content-wrapper {
  margin-top: 0.5rem;
  margin-left: 1.6rem;

  font-size: 28px;
}

@media (max-width: 1550px) {
  .statistics-card-wrapper {
    width: 11.5rem;
    height: 7rem;
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
