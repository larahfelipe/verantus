<template>
  <div :class="companyFinancialStatisticsStyles">
    <div class="company-financial-statistics-title-wrapper">
      <QIcon name="bi-bank" size="xs" />
      <h5>Financial Statistics</h5>
    </div>

    <div :class="statisticsDetailsStyles">
      <div class="valuation-measures-wrapper">
        <h6>Valuation Measures</h6>
        <StatisticsItem
          label="Price To Book"
          label-abbreviation="P/B"
          value="1"
        />
        <StatisticsItem
          label="Price To Book"
          label-abbreviation="P/E"
          value="1"
        />
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
        <StatisticsItem
          label="Trailing Earnings per Share"
          label-abbreviation="EPS"
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

      <div class="income-statements-wrapper">
        <h6>Income Statements</h6>
        <StatisticsItem label="Revenue" value="1" />
        <StatisticsItem label="Revenue per Share" value="1" />
        <StatisticsItem label="Quarterly Revenue Growth" value="1" />
        <StatisticsItem label="Gross Profit" value="1" />
        <StatisticsItem label="EBITDA" value="1" />
        <StatisticsItem label="Net Income to Common" value="1" />
      </div>

      <div class="management-effectiveness-wrapper">
        <h6>Management Effectiveness</h6>
        <StatisticsItem
          label="Return on Equity"
          label-abbreviation="ROE"
          value="1"
        />
        <StatisticsItem
          label="Return on Assets"
          label-abbreviation="ROA"
          value="1"
        />
      </div>

      <div class="dividends-and-splits-wrapper">
        <h6>Dividends &amp; Splits</h6>
        <StatisticsItem
          label="Dividend Yield"
          label-abbreviation="DY"
          value="1"
        />
        <StatisticsItem label="Payout Ratio" value="1" />
        <StatisticsItem label="Dividend per Share" value="1" />
        <StatisticsItem label="Dividend Date" value="1" />
        <StatisticsItem label="Ex-Dividend Date" value="1" />
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
