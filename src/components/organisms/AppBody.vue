<template>
  <div class="app-body-wrapper">
    <CompanyOverviewSection />

    <div class="company-stock-chart-and-statistics-wrapper">
      <div class="company-stock-chart-and-time-series-statistics-wrapper">
        <CompanyStockChartSection />
      </div>

      <CompanyFinancialStatisticsSection />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import CompanyFinancialStatisticsSection from '@/components/molecules/CompanyFinancialStatisticsSection.vue';
import CompanyOverviewSection from '@/components/molecules/CompanyOverviewSection.vue';
import CompanyStockChartSection from '@/components/molecules/CompanyStockChartSection.vue';

export default defineComponent({
  name: 'AppBody',
  components: {
    CompanyOverviewSection,
    CompanyStockChartSection,
    CompanyFinancialStatisticsSection
  }
});
</script>

<style scoped>
.app-body-wrapper {
  width: 100%;
  height: calc(100% - 5rem);

  display: flex;
  flex-direction: column;

  padding: 3rem;
}

.company-stock-chart-and-statistics-wrapper {
  width: 100%;
  height: 70%;

  display: flex;
  justify-content: space-between;
}

.company-stock-chart-and-time-series-statistics-wrapper {
  width: 70%;

  display: flex;
  flex-direction: column;
}
</style>
