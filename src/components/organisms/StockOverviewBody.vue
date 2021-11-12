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
    <div v-else class="title-wrapper">
      <div class="title-main">
        <h2>{{ stockOverview.quoteType.longName }}</h2>
        <h4>
          <em>{{ companySymbol }}</em>
        </h4>
      </div>
      <em>
        <div class="title-minor">
          <h5>Stock Price</h5>
          <h4>
            {{ stockOverview.financialData.currentPrice.fmt }}
          </h4>
          <h6>
            52-Week Change:
            {{ stockOverview.defaultKeyStatistics['52WeekChange'].fmt }}
          </h6>
        </div>
      </em>
    </div>

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

      <SkeletonLoader
        v-if="!isFetched"
        type="QToolbar"
        width="850px"
        height="450px"
        class="summary-wrapper"
      />
      <q-tab-panels v-else v-model="activeTab" animated>
        <q-tab-panel name="summary">
          <div class="summary-wrapper">
            <p>{{ stockOverview.assetProfile.longBusinessSummary }}</p>
          </div>
        </q-tab-panel>

        <q-tab-panel name="chart">
          <p>Graph</p>
        </q-tab-panel>

        <q-tab-panel name="statistics">
          <div class="statistics-wrapper">
            <div class="statistics-left-box">
              <h5 class="statistics-section-title">Valuation Measures</h5>
              <StatisticsItem
                long-label="Price to Book"
                short-label="(P/B)"
                :value="stockOverview.defaultKeyStatistics.priceToBook.fmt"
              />
              <StatisticsItem
                long-label="Enterprise Value"
                short-label="(EV)"
                :value="stockOverview.defaultKeyStatistics.enterpriseValue.fmt"
              />
              <StatisticsItem
                long-label="Forward Price to Earnings"
                short-label="(P/E)"
                :value="stockOverview.defaultKeyStatistics.forwardPE.fmt"
              />
              <StatisticsItem
                long-label="Price to Book"
                short-label="(P/B)"
                :value="stockOverview.defaultKeyStatistics.priceToBook.fmt"
              />
              <StatisticsItem
                long-label="Enterprise Value to Revenue"
                short-label="(EV/Revenue)"
                :value="
                  stockOverview.defaultKeyStatistics.enterpriseToRevenue.fmt
                "
              />
              <StatisticsItem
                long-label="Enterprise Value to EBITDA"
                short-label="(EV/EBITDA)"
                :value="
                  stockOverview.defaultKeyStatistics.enterpriseToEbitda.fmt
                "
              />
              <h5 class="statistics-section-title">Management Effectiveness</h5>
              <StatisticsItem
                long-label="Return on Assets"
                short-label="TTM"
                :value="stockOverview.financialData.returnOnAssets.fmt"
              />
              <StatisticsItem
                long-label="Return on Equity"
                short-label="TTM"
                :value="stockOverview.financialData.returnOnEquity.fmt"
              />
            </div>

            <div class="statistics-right-box">
              <h5 class="statistics-section-title">Income Statement</h5>
              <StatisticsItem
                long-label="Revenue"
                short-label="TTM"
                :value="stockOverview.financialData.totalRevenue.fmt"
              />
              <StatisticsItem
                long-label="Revenue Per Share"
                short-label="TTM"
                :value="stockOverview.financialData.revenuePerShare.fmt"
              />
              <StatisticsItem
                long-label="Quarterly Revenue Growth"
                short-label="YOY"
                :value="stockOverview.financialData.revenueGrowth.fmt"
              />
              <StatisticsItem
                long-label="Gross Profit"
                short-label="TTM"
                :value="stockOverview.financialData.grossProfits.fmt"
              />
              <StatisticsItem
                long-label="EBITDA"
                short-label="TTM"
                :value="stockOverview.financialData.ebitda.fmt"
              />
              <StatisticsItem
                long-label="Net Income to Common"
                short-label="TTM"
                :value="
                  stockOverview.defaultKeyStatistics.netIncomeToCommon.fmt
                "
              />
              <h5 class="statistics-section-title">Dividends &amp; Splits</h5>
              <StatisticsItem
                long-label="Last Dividend Value"
                :value="
                  stockOverview.defaultKeyStatistics.lastDividendValue.fmt
                "
              />
              <StatisticsItem
                long-label="Last Split Factor"
                :value="
                  stockOverview.defaultKeyStatistics.lastSplitFactor.toString()
                "
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

import SkeletonLoader from '@/components/molecules/SkeletonLoader.vue';
import StatisticsItem from '@/components/molecules/StatisticsItem.vue';
import { StockOverview } from '@/types';

export default defineComponent({
  name: 'StockOverviewBody',
  components: {
    SkeletonLoader,
    StatisticsItem
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
  margin-top: -2rem;

  display: flex;
  justify-content: space-around;
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
