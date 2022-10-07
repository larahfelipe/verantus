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
          value="1"
        />
        <StatisticsItem
          label="Forward Price to Earnings"
          label-abbreviation="P/E"
          value="1"
        />
        <StatisticsItem label="PEG Ratio" value="1" />
        <StatisticsItem
          label="Price to Book"
          label-abbreviation="P/B"
          value="1"
        />
        <StatisticsItem
          label="Enterprise Value to Revenue"
          label-abbreviation="EV/Revenue"
          value="1"
        />
        <StatisticsItem
          label="Enterprise Value to EBITDA"
          label-abbreviation="EV/EBITDA"
          value="1"
        />
      </div>

      <div class="fiscal-year-section-wrapper">
        <h6>Fiscal Year</h6>
        <StatisticsItem label="Fiscal Year Ends" value="1" />
        <StatisticsItem
          label="Most Recent Quarter"
          label-abbreviation="MRQ"
          value="1"
        />
      </div>

      <div class="profitability-section-wrapper">
        <h6>Profitability</h6>
        <StatisticsItem label="Profit Margin" value="1" />
        <StatisticsItem label="Operating Margin" value="1" />
      </div>

      <div class="income-statements-section-wrapper">
        <h6>Income Statements</h6>
        <StatisticsItem label="Revenue" label-abbreviation="TTM" value="1" />
        <StatisticsItem
          label="Revenue per Share"
          label-abbreviation="TTM"
          value="1"
        />
        <StatisticsItem
          label="Quarterly Revenue Growth"
          label-abbreviation="YOY"
          value="1"
        />
        <StatisticsItem
          label="Gross Profit"
          label-abbreviation="TTM"
          value="1"
        />
        <StatisticsItem label="EBITDA" value="1" />
        <StatisticsItem
          label="Net Income to Common"
          label-abbreviation="TTM"
          value="1"
        />
        <StatisticsItem
          label="Diluted Earnings per Share"
          label-abbreviation="EPS - TTM"
          value="1"
        />
        <StatisticsItem
          label="Quarterly Earnings Growth"
          label-abbreviation="YOY"
          value="1"
        />
      </div>

      <div class="management-effectiveness-section-wrapper">
        <h6>Management Effectiveness</h6>
        <StatisticsItem
          label="Return on Assets"
          label-abbreviation="ROA - TTM"
          value="1"
        />
        <StatisticsItem
          label="Return on Equity"
          label-abbreviation="ROE - TTM"
          value="1"
        />
      </div>

      <div class="balance-sheet-section-wrapper">
        <h6>Balance Sheet</h6>
        <StatisticsItem label="Total Cash" label-abbreviation="MRQ" value="1" />
        <StatisticsItem
          label="Total Cash Per Share"
          label-abbreviation="MRQ"
          value="1"
        />
        <StatisticsItem label="Total Debt" label-abbreviation="MRQ" value="1" />
        <StatisticsItem
          label="Current Ratio"
          label-abbreviation="MRQ"
          value="1"
        />
      </div>

      <div class="cash-flow-statistics-wrapper">
        <h6>Cash Flow</h6>
        <StatisticsItem
          label="Operating Cash Flow"
          label-abbreviation="TTM"
          value="1"
        />
        <StatisticsItem
          label="Levered Free Cash Flow"
          label-abbreviation="TTM"
          value="1"
        />
      </div>

      <div class="share-statistics-section-wrapper">
        <h6>Shares Statistics</h6>
        <StatisticsItem label="Shares Outstanding" value="1" />
        <StatisticsItem label="Float" value="1" />
        <StatisticsItem label="% Held by Insiders" value="1" />
        <StatisticsItem label="% Held by Institutions" value="1" />
      </div>

      <div class="dividends-and-splits-section-wrapper">
        <h6>Dividends &amp; Splits</h6>
        <StatisticsItem label="Dividend Date" value="1" />
        <StatisticsItem label="Last Dividend Value" value="1" />
        <StatisticsItem label="Last Split Date" value="1" />
        <StatisticsItem label="Last Split Factor" value="1" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import StatisticsItem from '@/components/molecules/StatisticsItem.vue';

export default defineComponent({
  name: 'CompanyFinancialStatisticsSection',
  components: {
    StatisticsItem
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
</style>
