<template>
  <div class="body-wrapper">
    <div v-if="!isFetched" class="title-skeleton-wrapper">
      <div class="title-main-skeleton-wrapper">
        <q-skeleton type="QInput" width="700px" />
        <q-skeleton type="text" width="300px" height="80px" />
      </div>
      <div class="title-minor-skeleton-wrapper">
        <q-skeleton type="text" width="300px" height="60px" />
        <q-skeleton type="text" width="400px" height="60px" />
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
          <h5>Stock Price</h5>
          <h4>
            {{ quoteOverview.financialData.currentPrice.fmt }}
          </h4>
          <h6>
            52-Week Change:
            {{ quoteOverview.defaultKeyStatistics['52WeekChange'].fmt }}
          </h6>
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
        <q-tab name="summary" label="Company Summary" />
        <q-tab name="chart" label="Chart" />
        <q-tab name="statistics" label="Statistics" />
      </q-tabs>

      <div v-if="!isFetched && !error" class="summary-wrapper">
        <q-skeleton type="QToolbar" width="850px" height="450px" />
      </div>
      <q-tab-panels v-else v-model="activeTab" animated>
        <q-tab-panel name="summary">
          <div class="summary-wrapper">
            <p>{{ quoteOverview.assetProfile.longBusinessSummary }}</p>
          </div>
        </q-tab-panel>
        <q-tab-panel name="chart">
          <p>Graph</p>
        </q-tab-panel>
        <q-tab-panel name="statistics">
          <div class="statistics-wrapper">
            <div class="statistics-left-box">
              <h5 class="statistics-section-title">Valuation Measures</h5>
              <BaseStatisticsItem
                long-label="Price to Book"
                short-label="(P/B)"
                :value="quoteOverview.defaultKeyStatistics.priceToBook.fmt"
              />
              <BaseStatisticsItem
                long-label="Enterprise Value"
                short-label="(EV)"
                :value="quoteOverview.defaultKeyStatistics.enterpriseValue.fmt"
              />
              <BaseStatisticsItem
                long-label="Forward Price to Earnings"
                short-label="(P/E)"
                :value="quoteOverview.defaultKeyStatistics.forwardPE.fmt"
              />
              <BaseStatisticsItem
                long-label="Price to Book"
                short-label="(P/B)"
                :value="quoteOverview.defaultKeyStatistics.priceToBook.fmt"
              />
              <BaseStatisticsItem
                long-label="Enterprise Value to Revenue"
                short-label="(EV/Revenue)"
                :value="
                  quoteOverview.defaultKeyStatistics.enterpriseToRevenue.fmt
                "
              />
              <BaseStatisticsItem
                long-label="Enterprise Value to EBITDA"
                short-label="(EV/EBITDA)"
                :value="
                  quoteOverview.defaultKeyStatistics.enterpriseToEbitda.fmt
                "
              />

              <h5 class="statistics-section-title">Management Effectiveness</h5>
              <BaseStatisticsItem
                long-label="Return on Assets"
                short-label="TTM"
                :value="quoteOverview.financialData.returnOnAssets.fmt"
              />
              <BaseStatisticsItem
                long-label="Return on Equity"
                short-label="TTM"
                :value="quoteOverview.financialData.returnOnEquity.fmt"
              />
            </div>
            <div class="statistics-right-box">
              <h5 class="statistics-section-title">Income Statement</h5>
              <BaseStatisticsItem
                long-label="Revenue"
                short-label="TTM"
                :value="quoteOverview.financialData.totalRevenue.fmt"
              />
              <BaseStatisticsItem
                long-label="Revenue Per Share"
                short-label="TTM"
                :value="quoteOverview.financialData.revenuePerShare.fmt"
              />
              <BaseStatisticsItem
                long-label="Quarterly Revenue Growth"
                short-label="YOY"
                :value="quoteOverview.financialData.revenueGrowth.fmt"
              />
              <BaseStatisticsItem
                long-label="Gross Profit"
                short-label="TTM"
                :value="quoteOverview.financialData.grossProfits.fmt"
              />
              <BaseStatisticsItem
                long-label="EBITDA"
                short-label="TTM"
                :value="quoteOverview.financialData.ebitda.fmt"
              />
              <BaseStatisticsItem
                long-label="Net Income to Common"
                short-label="TTM"
                :value="
                  quoteOverview.defaultKeyStatistics.netIncomeToCommon.fmt
                "
              />

              <h5 class="statistics-section-title">Dividends &amp; Splits</h5>
              <BaseStatisticsItem
                long-label="Last Dividend Value"
                :value="
                  quoteOverview.defaultKeyStatistics.lastDividendValue.fmt
                "
              />
              <BaseStatisticsItem
                long-label="Last Split Factor"
                :value="quoteOverview.defaultKeyStatistics.lastSplitFactor"
              />
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { mapGetters } from 'vuex';

import { QuoteOverview } from '@/types';

import BaseStatisticsItem from './BaseStatisticsItem.vue';

export default defineComponent({
  name: 'BaseQuoteOverviewBody',
  components: {
    BaseStatisticsItem
  },
  data() {
    return {
      activeTab: 'summary'
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
}

.title-wrapper h4,
.title-minor h6 {
  color: #929292;
}

.title-minor {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.tabs-skeleton-wrapper {
  margin-top: -2.2rem;

  display: flex;
  justify-content: space-evenly;
}

.tabs-options {
  border-bottom: 1px solid #e7e7e7;
}

.summary-wrapper {
  width: 75%;
  margin: 2.5rem auto;

  display: flex;
  justify-content: center;

  line-height: 30px;
  font-size: 16px;
}

.statistics-wrapper {
  display: flex;

  font-size: 16px;
}

.statistics-left-box,
.statistics-right-box {
  width: 25%;

  display: flex;
  flex-direction: column;
}

.statistics-section-title {
  margin-top: 3rem;
}

.statistics-left-box,
.statistics-right-box {
  width: 25%;

  display: flex;
  justify-content: space-evenly;
  flex: 1;
}

.statistics-left-box {
  margin-left: 3rem;
}
</style>
