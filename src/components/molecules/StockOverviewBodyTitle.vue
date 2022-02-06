<template>
  <div v-if="data" class="title-wrapper">
    <div class="title-main">
      <h2>{{ data.quoteType.longName }}</h2>
      <h4>
        <em>{{ symbol }}</em>
      </h4>
    </div>
    <em>
      <div class="title-minor">
        <h5>Stock Price</h5>
        <h4>
          {{ parsedStockPrice }}
        </h4>
        <h6>
          52-Week Change:
          {{ data.defaultKeyStatistics['52WeekChange'].fmt }}
        </h6>
      </div>
    </em>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { StockOverviewBodyTitleProps } from '@/types';

export default defineComponent({
  name: 'StockOverviewBodyTitle',
  props: {
    symbol: {
      type: String,
      required: true
    },
    data: {
      type: Object,
      required: true
    }
  } as StockOverviewBodyTitleProps,
  computed: {
    parsedStockPrice() {
      return this.data.financialData.financialCurrency === 'USD'
        ? `$ ${this.data.financialData.currentPrice.fmt}`
        : `R$ ${this.data.financialData.currentPrice.fmt}`;
    }
  }
});
</script>

<style scoped>
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
</style>
