<template>
  <div class="company-statistics-section-wrapper">
    <div class="statistics-title-wrapper">
      <QIcon name="bi-bar-chart" size="xs" />
      <h5>Statistics</h5>
    </div>

    <div class="statistics-details-wrapper">
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
  name: 'CompanyStatisticsSection',
  components: {
    StatisticsItem
  }
});
</script>

<style scoped>
.company-statistics-section-wrapper {
  width: 30%;
  height: 70%;

  align-self: flex-end;

  padding-top: 2rem;
  padding-bottom: 1.5rem;
}

.statistics-title-wrapper {
  display: flex;
  align-items: center;

  gap: 0.5rem;

  margin-bottom: 1rem;
}

.statistics-title-wrapper h5 {
  font-weight: 600;
}

.statistics-details-wrapper {
  height: 100%;

  display: flex;
  flex-direction: column;

  gap: 1rem;

  overflow: auto;
}

.statistics-details-wrapper h6 {
  padding-left: 0.5rem;
  margin-bottom: 0.8rem;

  background: #f5f5f7;
}
</style>
