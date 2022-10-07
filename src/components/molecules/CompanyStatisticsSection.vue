<template>
  <div class="company-statistics-section-wrapper">
    <div class="statistics-text-wrapper">
      <QIcon name="bi-bar-chart" size="sm" />
      <h5>Statistics</h5>
    </div>

    <div class="statistics-wrapper">
      <div class="valuation-measures-wrapper">
        <h6>Valuation Measures</h6>
        <p>Price to Book</p>
        <p>Enterprise Value</p>
        <p>Forward Price to Earnings</p>
        <p>Trailing Earnings per Share</p>
        <p>Enterprise Value to Revenue</p>
        <p>Enterprise Value to EBITDA</p>
      </div>

      <div class="income-statements-wrapper">
        <h6>Income Statements</h6>
        <p>Revenue</p>
        <p>Revenue per Share</p>
        <p>Quarterly Revenue Growth</p>
        <p>Gross Profit</p>
        <p>EBITDA</p>
        <p>Net Income to Common</p>
      </div>

      <div class="management-effectiveness-wrapper">
        <h6>Management Effectiveness</h6>
        <p>Return on Assets</p>
        <p>Return on Equity</p>
      </div>

      <div class="dividends-and-splits-wrapper">
        <h6>Dividends &amp; Splits</h6>
        <p>Dividend Yield</p>
        <p>Payout Ratio</p>
        <p>Dividend Date</p>
        <p>Ex-Dividend Date</p>
        <p>Last Split Factor</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CompanyStatisticsSection'
});
</script>

<style scoped>
.company-statistics-section-wrapper {
  width: 17%;

  margin-left: 3.5rem;
}

.statistics-text-wrapper {
  width: 25%;

  display: flex;
  align-items: center;

  gap: 0.5rem;
}

.statistics-text-wrapper h5 {
  width: fit-content;

  font-weight: 600;
}

.statistics-wrapper {
  height: 95%;

  display: flex;
  flex-direction: column;

  margin-top: 1rem;

  overflow: auto;
}

.statistics-wrapper h6 {
  margin-bottom: 0.8rem;

  background: #f5f5f7;
}

.statistics-wrapper p {
  border-bottom: 1px solid #ebedf3;
}

.statistics-wrapper h6,
.statistics-wrapper p {
  padding-left: 0.5rem;
}
</style>
