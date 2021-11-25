<template>
  <div class="body-wrapper">
    <div v-if="!isFetched" class="title-skeleton-wrapper">
      <SkeletonLoader
        repeat
        :type="['QInput', 'text']"
        :width="['700px', '300px']"
        :height="['80px', '80px']"
        class="title-main-skeleton-wrapper"
      />
      <SkeletonLoader
        repeat
        :type="['text', 'text', 'text']"
        :width="['300px', '250px', '350px']"
        :height="['60px', '80px', '50px']"
        class="title-minor-skeleton-wrapper"
      />
    </div>
    <StockOverviewBodyTitle
      v-else
      :symbol="companySymbol"
      :data="stockOverview"
    />

    <div class="content-wrapper">
      <SkeletonLoader
        v-if="!isFetched"
        repeat
        inline
        :type="['rect', 'rect', 'rect']"
        :width="['200px', '200px', '200px']"
        :height="['20px', '20px', '20px']"
        class="tabs-skeleton-wrapper"
      />
      <q-tabs
        v-else
        v-model="activeTab"
        dense
        no-caps
        narrow-indicator
        align="justify"
        indicator-color="green-13"
        class="tabs-options"
      >
        <q-tab name="summary" label="Company Summary" />
        <q-tab name="chart" label="Chart" />
        <q-tab name="statistics" label="Statistics" />
      </q-tabs>

      <SkeletonLoader
        v-if="!isFetched"
        type="QToolbar"
        width="850px"
        height="450px"
        class="tab-content-skeleton-wrapper"
      />
      <q-tab-panels v-else v-model="activeTab" animated>
        <q-tab-panel name="summary">
          <SummaryTab :text="stockOverview.assetProfile.longBusinessSummary" />
        </q-tab-panel>

        <q-tab-panel name="chart">
          <ChartTab :data="stockChart" />
        </q-tab-panel>

        <q-tab-panel name="statistics">
          <StatisticsTab :data="stockOverview" />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { mapGetters } from 'vuex';

import ChartTab from '@/components/molecules/ChartTab.vue';
import SkeletonLoader from '@/components/molecules/SkeletonLoader.vue';
import StatisticsTab from '@/components/molecules/StatisticsTab.vue';
import StockOverviewBodyTitle from '@/components/molecules/StockOverviewBodyTitle.vue';
import SummaryTab from '@/components/molecules/SummaryTab.vue';
import { StockOverview, StockChart } from '@/types';

export default defineComponent({
  name: 'StockOverviewBody',
  components: {
    SkeletonLoader,
    StockOverviewBodyTitle,
    SummaryTab,
    ChartTab,
    StatisticsTab
  },
  data() {
    return {
      activeTab: 'summary'
    };
  },
  computed: {
    stockOverview() {
      const value = this.$store.getters[
        'overview/stockOverview'
      ] as StockOverview;
      return value.quoteSummary.result[0];
    },
    stockChart() {
      const value = this.$store.getters['overview/stockChart'] as StockChart;
      return value.chart.result[0];
    },
    companySymbol() {
      const value = this.stockOverview.quoteType.symbol;
      const parsedSymbol = value.split('.')[0] as string;
      return parsedSymbol;
    },
    ...mapGetters('overview', {
      isFetched: 'isFetched',
      error: 'error'
    })
  }
});
</script>

<style scoped>
.title-skeleton-wrapper {
  margin: 5rem;

  display: flex;
  justify-content: space-between;
}

.title-main-skeleton-wrapper,
.title-minor-skeleton-wrapper {
  display: flex;
  flex-direction: column;
}

.title-minor-skeleton-wrapper {
  align-items: flex-end;
}

.tabs-skeleton-wrapper {
  margin-top: -2rem;

  display: flex;
  justify-content: space-around;
}

.tab-content-skeleton-wrapper {
  width: 75%;
  margin: 2.5rem auto;

  display: flex;
  justify-content: center;

  line-height: 30px;
}

.tabs-options {
  border-bottom: 1px solid #e7e7e7;
}
</style>
