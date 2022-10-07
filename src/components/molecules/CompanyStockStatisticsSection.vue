<template>
  <div class="company-stock-statistics-section-wrapper">
    <StatisticsCardProps title="Recommendation">
      <span>BUY</span>
    </StatisticsCardProps>

    <StatisticsCardProps title="Previous Close">
      <span>$ 145.43</span>
    </StatisticsCardProps>

    <StatisticsCardProps title="52 Week Change">
      <div class="week-change-wrapper">
        <QIcon name="bi-arrow-down-circle" size="sm" />
        <span>-14.73%</span>
      </div>
    </StatisticsCardProps>

    <StatisticsCardProps title="52 Week High">
      <span>$ 220.00</span>
    </StatisticsCardProps>

    <StatisticsCardProps title="52 Week Low">
      <span>$ 130.00</span>
    </StatisticsCardProps>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import StatisticsCardProps from '@/components/molecules/StatisticsCard.vue';

export default defineComponent({
  name: 'CompanyStockStatisticsSection',
  components: {
    StatisticsCardProps
  }
});
</script>

<style scoped>
.company-stock-statistics-section-wrapper {
  height: 20%;

  display: flex;
  justify-content: space-evenly;
  align-items: center;

  padding-top: 1.5rem;
}

.week-change-wrapper {
  display: flex;
  align-items: center;

  gap: 0.75rem;
}
</style>
