<template>
  <div :class="companyOverviewStyles">
    <div class="company-name-and-stock-details-wrapper">
      <div class="company-name-and-exchange-wrapper">
        <h2>{{ data.companyName }}</h2>

        <div class="company-stock-exchange-wrapper">
          <h4>{{ fmtStockSymbol }}</h4>

          <div class="stock-exchange-name-wrapper">
            <QIcon name="bi-graph-up" size="xs" />
            <h6>{{ data.stockExchange }}</h6>
          </div>
        </div>
      </div>

      <div class="company-stock-price-wrapper">
        <h3>{{ fmtStockPrice }}</h3>

        <div :class="companyStockPriceFloatStyles">
          <QIcon
            v-if="data.stockPriceChangeSinceOpen.value > 0"
            name="bi-arrow-up-circle"
            size="xs"
          />
          <QIcon v-else name="bi-arrow-down-circle" size="xs" />
          <h6>{{ fmtStockPriceFloat }}</h6>
        </div>
      </div>
    </div>

    <div class="company-summary-wrapper">
      <div class="company-summary-title-wrapper">
        <div class="title-wrapper">
          <QIcon name="bi-card-text" size="xs" />
          <h5>About</h5>
        </div>

        <div class="website-wrapper">
          <a :href="data.companyWebsite">
            <QIcon name="bi-box-arrow-in-up-right" size="xs" />
            <strong>Official website</strong>
          </a>
        </div>
      </div>

      <div :class="companyDescriptionStyles">
        <p>{{ data.companyBusinessSummary }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CompanyOverviewSection',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    theme() {
      return this.$store.getters['theme/currentTheme'];
    },
    companyOverviewStyles() {
      return this.theme === 'dark'
        ? 'company-overview-section-wrapper company-overview-section-wrapper__dark'
        : 'company-overview-section-wrapper';
    },
    companyStockPriceFloatStyles() {
      return this.data.stockPriceChangeSinceOpen.value > 0
        ? 'stock-price-float-wrapper stock-price-float-wrapper--positive'
        : 'stock-price-float-wrapper stock-price-float-wrapper--negative';
    },
    companyDescriptionStyles() {
      return this.theme === 'dark'
        ? 'company-description-wrapper company-description-wrapper__dark'
        : 'company-description-wrapper';
    },
    fmtStockSymbol() {
      return this.data.stockSymbol.endsWith('.SA')
        ? this.data.stockSymbol.slice(0, -3)
        : this.data.stockSymbol;
    },
    fmtStockPrice() {
      const currency = this.data.stockFinancialCurrency === 'USD' ? '$' : 'R$';

      return `${currency} ${this.data.currentStockPrice}`;
    },
    fmtStockPriceFloat() {
      return `${this.data.stockPriceChangeSinceOpen.value} (${this.data.stockPriceChangeSinceOpen.percentage}%)`;
    }
  }
});
</script>

<style scoped>
.company-overview-section-wrapper {
  width: 100%;
  height: 30%;

  display: flex;
  justify-content: space-between;
}

.company-overview-section-wrapper__dark {
  color: #dddcdc;
}

.company-name-and-stock-details-wrapper {
  width: 70%;

  display: flex;
  justify-content: space-between;
}

.company-name-and-exchange-wrapper {
  margin: 2rem;
}

.company-name-and-exchange-wrapper h2 {
  font-size: 64px;
}

.company-overview-section-wrapper__dark h2 {
  color: #f2f3f5;
}

.company-stock-exchange-wrapper {
  display: flex;
  align-items: flex-end;

  margin-top: 1.5rem;
  gap: 1.4rem;
}

.company-stock-exchange-wrapper h4 {
  color: #464c58;
}

.company-overview-section-wrapper__dark h4 {
  color: #ddd;
}

.company-stock-exchange-wrapper .stock-exchange-name-wrapper {
  display: flex;
  align-items: center;

  gap: 0.5rem;
}

.stock-exchange-name-wrapper h6,
.stock-exchange-name-wrapper i {
  color: #a0a4a9;
}

.company-stock-price-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  gap: 1rem;

  margin-top: 2rem;
  margin-right: 5rem;
}

.stock-price-float-wrapper {
  display: flex;
  align-items: center;

  gap: 0.25rem;
}

.stock-price-float-wrapper--positive {
  color: green;
}

.stock-price-float-wrapper--negative {
  color: red;
}

.company-summary-wrapper {
  width: 30%;

  display: flex;
  flex-direction: column;
}

.company-summary-title-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-wrapper {
  display: flex;
  align-items: center;

  gap: 0.5rem;
}

.title-wrapper h5 {
  font-weight: 600;
}

.website-wrapper strong {
  margin-left: 0.3rem;
}

.company-description-wrapper {
  height: 100%;

  margin-top: 1rem;

  overflow-y: auto;
}

.company-description-wrapper__dark::-webkit-scrollbar-track {
  background-color: #18191c;
}

.company-description-wrapper__dark::-webkit-scrollbar-thumb {
  background-color: #505050;
}

.company-description-wrapper__dark::-webkit-scrollbar-thumb:hover {
  background-color: #767676;
}
</style>
