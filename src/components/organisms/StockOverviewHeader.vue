<template>
  <div class="header-wrapper">
    <div class="input-wrapper">
      <SearchInputField
        outlined
        square
        :input-style="{ width: '550px' }"
        label="Company Symbol"
        :loading="isLoading"
        @change-event="handleEnteredValue"
      />
      <div class="option-wrapper">
        <ExchangeOptionInput
          inline
          :options="options"
          @select-event="handleSelectOption"
        />
      </div>
    </div>
    <q-btn
      rounded
      outline
      color="green-6"
      icon="search"
      padding="md xl"
      @click="handleFetchStockOverview"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import ExchangeOptionInput from '@/components/molecules/ExchangeOptionInput.vue';
import SearchInputField from '@/components/molecules/SearchInputField.vue';
import { Payload } from '@/types';

export default defineComponent({
  name: 'StockOverviewHeader',
  components: {
    SearchInputField,
    ExchangeOptionInput
  },
  data() {
    return {
      stockSymbol: '',
      stockExchange: '',
      modules: 'assetProfile,quoteType,defaultKeyStatistics,financialData',
      options: [
        {
          label: 'US Stock',
          value: ''
        },
        {
          label: 'BR Stock',
          value: '.SA'
        }
      ]
    };
  },
  computed: {
    isLoading() {
      return this.$store.getters['overview/isLoading'];
    }
  },
  methods: {
    handleEnteredValue(value: string) {
      this.stockSymbol = value;
    },
    handleSelectOption(value: string) {
      this.stockExchange = value;
    },
    handleFetchStockOverview() {
      const payload = {
        stockSymbol: this.stockSymbol,
        stockExchange: this.stockExchange,
        modules: this.modules
      } as Payload;

      this.$store.dispatch('overview/fetchStockOverview', payload);
      this.$store.dispatch('overview/fetchStockChart', payload);
    }
  }
});
</script>

<style scoped>
.header-wrapper {
  width: 100%;
  height: 100px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 1.5rem 1rem;

  box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px;
}

.input-wrapper {
  display: flex;

  margin-right: 2rem;
}

.option-wrapper {
  height: 56px;
  width: 250px;

  display: flex;
  justify-content: center;
  align-items: center;

  border: 1px solid #ccc;
  border-left: none;

  background: #f0f2f7;
}
</style>
