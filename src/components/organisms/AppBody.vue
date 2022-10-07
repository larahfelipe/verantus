<template>
  <div class="app-body-wrapper">
    <CompanyOverviewSection />
    <CompanyStatisticsSection />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import CompanyOverviewSection from '@/components/molecules/CompanyOverviewSection.vue';
import CompanyStatisticsSection from '@/components/molecules/CompanyStatisticsSection.vue';

export default defineComponent({
  name: 'AppBody',
  components: {
    CompanyOverviewSection,
    CompanyStatisticsSection
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
</style>
