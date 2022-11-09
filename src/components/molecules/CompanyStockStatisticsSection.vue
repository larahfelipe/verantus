<template>
  <div class="company-stock-statistics-section-wrapper">
    <StatisticsCardProps title="Recommendation">
      <div :class="recommendationCardStyles">
        <span>{{ data.analystRecommendation.toUpperCase() }}</span>
      </div>
    </StatisticsCardProps>

    <StatisticsCardProps title="Previous Close">
      <span>{{ fmtPreviousClose }}</span>
    </StatisticsCardProps>

    <StatisticsCardProps title="52 Week Change">
      <div :class="fiftyTwoWeekChangeCardStyles">
        <QIcon
          v-if="data.fiftyTwoWeekChange > 0"
          name="bi-arrow-up-circle"
          size="sm"
        />
        <QIcon v-else name="bi-arrow-down-circle" size="sm" />
        <span>{{ fmtFiftyTwoWeekChange }}</span>
      </div>
    </StatisticsCardProps>

    <StatisticsCardProps title="52 Week High">
      <span>{{ fmtFiftyTwoWeekHigh }}</span>
    </StatisticsCardProps>

    <StatisticsCardProps title="52 Week Low">
      <span>{{ fmtFiftyTwoWeekLow }}</span>
    </StatisticsCardProps>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import StatisticsCardProps from '@/components/molecules/StatisticsCard.vue';
import { parseCurrency } from '@/utils/functions/parseCurrency';

export default defineComponent({
  name: 'CompanyStockStatisticsSection',
  components: {
    StatisticsCardProps
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    recommendationCardStyles() {
      return this.data.analystRecommendation === 'buy'
        ? 'recommendation-text-wrapper recommendation-text-wrapper--buy'
        : 'recommendation-text-wrapper recommendation-text-wrapper--sell';
    },
    fiftyTwoWeekChangeCardStyles() {
      return this.data.fiftyTwoWeekChange > 0
        ? 'week-change-wrapper week-change-wrapper--positive'
        : 'week-change-wrapper week-change-wrapper--negative';
    },
    parsedCurrency() {
      return parseCurrency(this.data.stockFinancialCurrency);
    },
    fmtPreviousClose() {
      return `${this.parsedCurrency} ${this.data.previousClosePrice}`;
    },
    fmtFiftyTwoWeekChange() {
      return `${(this.data.fiftyTwoWeekChange * 100).toFixed(2)}%`;
    },
    fmtFiftyTwoWeekHigh() {
      return `${this.parsedCurrency} ${this.data.fiftyTwoWeekHigh}`;
    },
    fmtFiftyTwoWeekLow() {
      return `${this.parsedCurrency} ${this.data.fiftyTwoWeekLow}`;
    }
  }
});
</script>

<style scoped>
.company-stock-statistics-section-wrapper {
  height: 20%;

  display: flex;
  justify-content: space-evenly;
  align-items: center;

  padding-top: 1.5rem;
}

.recommendation-text-wrapper {
  width: fit-content;

  padding: 0 0.8rem;

  border-radius: 1.5rem;
}

.recommendation-text-wrapper--buy {
  border: 1px solid green;
}

.recommendation-text-wrapper--sell {
  border: 1px solid red;
}

.week-change-wrapper {
  display: flex;
  align-items: center;

  gap: 0.75rem;
}

.recommendation-text-wrapper--buy,
.week-change-wrapper--positive {
  color: green;
}

.recommendation-text-wrapper--sell,
.week-change-wrapper--negative {
  color: red;
}

@media (max-width: 1550px) {
  .company-stock-statistics-section-wrapper {
    width: 100%;
    height: 40%;

    justify-content: space-between;

    gap: 1rem;
    padding: 0 1.5rem;

    overflow-x: auto;
  }
  .company-stock-statistics-section-wrapper span {
    font-size: 22px;
  }
}
</style>
