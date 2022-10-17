<template>
  <div :class="companyFinancialStatisticsStyles">
    <div class="company-financial-statistics-title-wrapper">
      <QIcon name="bi-bank" size="xs" />
      <h5>Financial Statistics</h5>
    </div>

    <div :class="statisticsDetailsStyles">
      <div class="valuation-measures-section-wrapper">
        <h6>Valuation Measures</h6>
        <StatisticsItem
          label="Enterprise Value"
          label-abbreviation="EV"
          :value="data.enterpriseValue"
        />
        <StatisticsItem
          label="Forward Price to Earnings"
          label-abbreviation="P/E"
          :value="data.forwardPriceToEarnings"
        />
        <StatisticsItem label="PEG Ratio" :value="data.pegRatio" />
        <StatisticsItem
          label="Price to Book"
          label-abbreviation="P/B"
          :value="data.priceToBook"
        />
        <StatisticsItem
          label="Enterprise Value to Revenue"
          label-abbreviation="EV/Revenue"
          :value="data.enterpriseValueToRevenue"
        />
        <StatisticsItem
          label="Enterprise Value to EBITDA"
          label-abbreviation="EV/EBITDA"
          :value="data.enterpriseValueToEbitda"
        />
      </div>

      <div class="fiscal-year-section-wrapper">
        <h6>Fiscal Year</h6>
        <StatisticsItem
          label="Fiscal Year Ends"
          :value="parseDate(data.fiscalYearEnds)"
        />
        <StatisticsItem
          label="Most Recent Quarter"
          label-abbreviation="MRQ"
          :value="parseDate(data.mostRecentQuarter)"
        />
      </div>

      <div class="profitability-section-wrapper">
        <h6>Profitability</h6>
        <StatisticsItem label="Profit Margin" :value="data.profitMargin" />
        <StatisticsItem
          label="Operating Margin"
          :value="data.operatingMargin"
        />
      </div>

      <div class="income-statements-section-wrapper">
        <h6>Income Statements</h6>
        <StatisticsItem
          label="Revenue"
          label-abbreviation="TTM"
          :value="data.revenue"
        />
        <StatisticsItem
          label="Revenue per Share"
          label-abbreviation="TTM"
          :value="data.revenuePerShare"
        />
        <StatisticsItem
          label="Quarterly Revenue Growth"
          label-abbreviation="YOY"
          :value="data.quarterlyRevenueGrowth"
        />
        <StatisticsItem
          label="Gross Profit"
          label-abbreviation="TTM"
          :value="data.grossProfit"
        />
        <StatisticsItem label="EBITDA" :value="data.ebitda" />
        <StatisticsItem
          label="Net Income to Common"
          label-abbreviation="TTM"
          :value="data.netIncomeToCommon"
        />
        <StatisticsItem
          label="Diluted Earnings per Share"
          label-abbreviation="EPS - TTM"
          :value="data.dilutedEarningsPerShare"
        />
        <StatisticsItem
          label="Quarterly Earnings Growth"
          label-abbreviation="YOY"
          :value="data.quarterlyEarningsGrowth"
        />
      </div>

      <div class="management-effectiveness-section-wrapper">
        <h6>Management Effectiveness</h6>
        <StatisticsItem
          label="Return on Assets"
          label-abbreviation="ROA - TTM"
          :value="data.returnOnAssets"
        />
        <StatisticsItem
          label="Return on Equity"
          label-abbreviation="ROE - TTM"
          :value="data.returnOnEquity"
        />
      </div>

      <div class="balance-sheet-section-wrapper">
        <h6>Balance Sheet</h6>
        <StatisticsItem
          label="Total Cash"
          label-abbreviation="MRQ"
          :value="data.totalCash"
        />
        <StatisticsItem
          label="Total Cash Per Share"
          label-abbreviation="MRQ"
          :value="data.totalCashPerShare"
        />
        <StatisticsItem
          label="Total Debt"
          label-abbreviation="MRQ"
          :value="data.totalDebt"
        />
        <StatisticsItem
          label="Total Debt To Equity"
          label-abbreviation="MRQ"
          :value="data.totalDebtToEquity"
        />
        <StatisticsItem
          label="Current Ratio"
          label-abbreviation="MRQ"
          :value="data.currentRatio"
        />
      </div>

      <div class="cash-flow-statistics-wrapper">
        <h6>Cash Flow</h6>
        <StatisticsItem
          label="Operating Cash Flow"
          label-abbreviation="TTM"
          :value="data.operatingCashFlow"
        />
        <StatisticsItem
          label="Levered Free Cash Flow"
          label-abbreviation="TTM"
          :value="data.leveredFreeCashFlow"
        />
      </div>

      <div class="share-statistics-section-wrapper">
        <h6>Shares Statistics</h6>
        <StatisticsItem
          label="Shares Outstanding"
          :value="data.sharesOutstanding"
        />
        <StatisticsItem label="Float" :value="data.sharesFloat" />
        <StatisticsItem
          label="% Held by Insiders"
          :value="data.sharesHeldByInsiders"
        />
        <StatisticsItem
          label="% Held by Institutions"
          :value="data.sharesHeldByInstitutions"
        />
      </div>

      <div class="dividends-and-splits-section-wrapper">
        <h6>Dividends &amp; Splits</h6>
        <StatisticsItem
          label="Dividend Date"
          :value="parseDate(data.dividendDate)"
        />
        <StatisticsItem
          label="Last Dividend Value"
          :value="data.lastDividendValue"
        />
        <StatisticsItem
          label="Last Split Date"
          :value="parseDate(data.lastSplitDate)"
        />
        <StatisticsItem
          label="Last Split Factor"
          :value="data.lastSplitFactor"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import StatisticsItem from '@/components/molecules/StatisticsItem.vue';
import { parseDate as parseDateUtil } from '@/utils/functions/parseDate';

export default defineComponent({
  name: 'CompanyFinancialStatisticsSection',
  components: {
    StatisticsItem
  },
  props: {
    data: {
      type: Object || null,
      required: true
    }
  },
  computed: {
    theme() {
      return this.$store.getters['theme/currentTheme'];
    },
    companyFinancialStatisticsStyles() {
      return this.theme === 'dark'
        ? 'company-financial-statistics-section-wrapper company-financial-statistics-section-wrapper__dark'
        : 'company-financial-statistics-section-wrapper';
    },
    statisticsDetailsStyles() {
      return this.theme === 'dark'
        ? 'financial-statistics-details-wrapper financial-statistics-details-wrapper__dark'
        : 'financial-statistics-details-wrapper';
    }
  },
  methods: {
    parseDate(value: string) {
      const fmtValue = parseDateUtil(value, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      if (!fmtValue) return '-';

      return fmtValue;
    }
  }
});
</script>

<style scoped>
.company-financial-statistics-section-wrapper {
  width: 30%;

  padding-top: 2rem;
  padding-bottom: 1.5rem;
}

.company-financial-statistics-section-wrapper__dark {
  color: #dddcdc;
}

.company-financial-statistics-title-wrapper {
  display: flex;
  align-items: center;

  gap: 0.5rem;

  margin-bottom: 1rem;
}

.company-financial-statistics-title-wrapper h5 {
  font-weight: 600;
}

.financial-statistics-details-wrapper {
  height: 100%;

  display: flex;
  flex-direction: column;

  gap: 1rem;

  overflow-y: auto;
}

.financial-statistics-details-wrapper__dark::-webkit-scrollbar-track {
  background-color: #18191c;
}

.financial-statistics-details-wrapper__dark::-webkit-scrollbar-thumb {
  background-color: #505050;
}

.financial-statistics-details-wrapper__dark::-webkit-scrollbar-thumb:hover {
  background-color: #767679;
}

.financial-statistics-details-wrapper h6 {
  padding-left: 0.5rem;
  margin-bottom: 0.8rem;

  background-color: #ebebeb;
}

.company-financial-statistics-section-wrapper__dark h6 {
  background-color: #1f2122;
}

@media (max-width: 1550px) {
  .company-financial-statistics-section-wrapper {
    padding-top: unset;
  }
}
@media (max-width: 1190px) {
  .company-financial-statistics-section-wrapper {
    width: 100%;

    margin-top: 3rem;
  }
}
</style>
