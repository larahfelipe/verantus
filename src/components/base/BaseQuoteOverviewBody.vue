<template>
  <div class="body-wrapper">
    <div v-if="!isFetched" class="title-skeleton-wrapper">
      <div class="title-main-skeleton-wrapper">
        <q-skeleton type="QInput" width="700px" />
        <q-skeleton type="text" width="300px" height="80px" />
      </div>
      <div class="title-minor-skeleton-wrapper">
        <q-skeleton type="text" width="400px" height="60px" />
        <q-skeleton type="text" width="300px" height="50px" />
        <q-skeleton type="text" width="300px" height="50px" />
      </div>
    </div>
    <div v-else class="title-wrapper">
      <div class="title-main">
        <h2>{{ quoteOverview.quoteType.longName }}</h2>
        <h4>
          <em>{{ companySymbol }}</em>
        </h4>
      </div>
      <em>
        <div class="title-minor">
          <h5>Timezone & Exchange</h5>
          <h6>{{ quoteOverview.quoteType.timeZoneFullName }}</h6>
          <h6>{{ quoteOverview.quoteType.exchange }}</h6>
        </div>
      </em>
    </div>

    <div class="content-wrapper">
      <div v-if="!isFetched" class="tabs-skeleton-wrapper">
        <q-skeleton type="rect" width="200px" />
        <q-skeleton type="rect" width="200px" />
        <q-skeleton type="rect" width="200px" />
      </div>
      <q-tabs
        v-else
        v-model="activeTab"
        class="tabs-options"
        dense
        no-caps
        narrow-indicator
        align="justify"
        indicator-color="green-13"
      >
        <q-tab name="overview" label="Company Overview" />
        <q-tab name="chart" label="Chart" />
        <q-tab name="placeholder" label="Placeholder" />
      </q-tabs>

      <div v-if="!isFetched && !error" class="overview-wrapper">
        <q-skeleton type="QToolbar" width="800px" height="500px" />
      </div>
      <q-tab-panels v-else v-model="activeTab" animated>
        <q-tab-panel name="overview">
          <div class="overview-wrapper">
            {{ quoteOverview.assetProfile.longBusinessSummary }}
          </div>
        </q-tab-panel>
        <q-tab-panel name="chart">
          <p>Graph</p>
        </q-tab-panel>
        <q-tab-panel name="placeholder">
          <p>Placeholder</p>
        </q-tab-panel>
      </q-tab-panels>
      <div v-if="error && isFetched">
        {{ JSON.stringify(error) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { mapGetters } from 'vuex';

import { QuoteOverview } from '@/types';

export default defineComponent({
  name: 'BaseQuoteOverviewBody',
  data() {
    return {
      activeTab: 'overview'
    };
  },
  computed: {
    quoteOverview() {
      const value = this.$store.getters[
        'overview/quoteOverview'
      ] as QuoteOverview;
      return value.quoteSummary.result[0];
    },
    companySymbol() {
      const value = this.quoteOverview.quoteType.symbol;
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

.title-wrapper {
  margin: 5rem;

  display: flex;
  justify-content: space-between;
}

.title-wrapper h4 {
  margin-top: 0.75rem;

  color: #929292;
}

.title-minor {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.title-minor h6 {
  color: #929292;
}

.tabs-skeleton-wrapper {
  display: flex;
  justify-content: space-evenly;
}

.tabs-options {
  border-bottom: 1px solid #e7e7e7;
}

.overview-wrapper {
  width: 50%;
  padding-top: 15px;
  margin: auto;
  display: flex;

  font-size: 16px;
}
</style>
