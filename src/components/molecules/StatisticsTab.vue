<template>
  <div v-if="data" class="statistics-wrapper">
    <div class="statistics-left-box">
      <h5 class="statistics-section-title">Valuation Measures</h5>
      <StatisticsItem
        long-label="Price to Book"
        short-label="(P/B)"
        :value="data.defaultKeyStatistics.priceToBook.fmt"
      />
      <StatisticsItem
        long-label="Enterprise Value"
        short-label="(EV)"
        :value="data.defaultKeyStatistics.enterpriseValue.fmt"
      />
      <StatisticsItem
        long-label="Forward Price to Earnings"
        short-label="(P/E)"
        :value="data.defaultKeyStatistics.forwardPE.fmt"
      />
      <StatisticsItem
        long-label="Price to Book"
        short-label="(P/B)"
        :value="data.defaultKeyStatistics.priceToBook.fmt"
      />
      <StatisticsItem
        long-label="Enterprise Value to Revenue"
        short-label="(EV/Revenue)"
        :value="data.defaultKeyStatistics.enterpriseToRevenue.fmt"
      />
      <StatisticsItem
        long-label="Enterprise Value to EBITDA"
        short-label="(EV/EBITDA)"
        :value="data.defaultKeyStatistics.enterpriseToEbitda.fmt"
      />
      <h5 class="statistics-section-title">Management Effectiveness</h5>
      <StatisticsItem
        long-label="Return on Assets"
        short-label="TTM"
        :value="data.financialData.returnOnAssets.fmt"
      />
      <StatisticsItem
        long-label="Return on Equity"
        short-label="TTM"
        :value="data.financialData.returnOnEquity.fmt"
      />
    </div>

    <div class="statistics-right-box">
      <h5 class="statistics-section-title">Income Statement</h5>
      <StatisticsItem
        long-label="Revenue"
        short-label="TTM"
        :value="data.financialData.totalRevenue.fmt"
      />
      <StatisticsItem
        long-label="Revenue Per Share"
        short-label="TTM"
        :value="data.financialData.revenuePerShare.fmt"
      />
      <StatisticsItem
        long-label="Quarterly Revenue Growth"
        short-label="YOY"
        :value="data.financialData.revenueGrowth.fmt"
      />
      <StatisticsItem
        long-label="Gross Profit"
        short-label="TTM"
        :value="data.financialData.grossProfits.fmt"
      />
      <StatisticsItem
        long-label="EBITDA"
        short-label="TTM"
        :value="data.financialData.ebitda.fmt"
      />
      <StatisticsItem
        long-label="Net Income to Common"
        short-label="TTM"
        :value="data.defaultKeyStatistics.netIncomeToCommon.fmt"
      />
      <h5 class="statistics-section-title">Dividends &amp; Splits</h5>
      <StatisticsItem
        long-label="Last Dividend Value"
        :value="data.defaultKeyStatistics.lastDividendValue.fmt"
      />
      <StatisticsItem
        long-label="Last Split Factor"
        :value="data.defaultKeyStatistics.lastSplitFactor.toString()"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import StatisticsItem from '@/components/molecules/StatisticsItem.vue';
import { StatisticsTabProps } from '@/types';

export default defineComponent({
  name: 'StatisticsTab',
  components: {
    StatisticsItem
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  } as StatisticsTabProps
});
</script>

<style scoped>
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
