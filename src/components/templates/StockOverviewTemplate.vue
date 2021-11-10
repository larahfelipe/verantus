<template>
  <div class="app-wrapper">
    <SideMenu />
    <div class="stock-wrapper">
      <StockOverviewHeader />
      <StockOverviewBody />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import SideMenu from '@/components/organisms/SideMenu.vue';
import StockOverviewBody from '@/components/organisms/StockOverviewBody.vue';
import StockOverviewHeader from '@/components/organisms/StockOverviewHeader.vue';

export default defineComponent({
  name: 'StockOverviewTemplate',
  components: {
    SideMenu,
    StockOverviewHeader,
    StockOverviewBody
  },
  created() {
    this.$store.dispatch('overview/fetchQuoteOverview', {
      stockSymbol: 'AAPL',
      stockExchange: '',
      modules: 'assetProfile,quoteType,defaultKeyStatistics,financialData'
    });
  }
});
</script>

<style scoped>
.app-wrapper {
  width: 100vw;
  height: 100vh;

  display: grid;
  grid-template-columns: 1fr 4fr;
}

.stock-wrapper {
  display: grid;
  grid-template-rows: 1fr 9fr;

  overflow: hidden;
}
</style>
