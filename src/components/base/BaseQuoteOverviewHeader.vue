<template>
  <div class="header-wrapper">
    <input type="text" v-model.trim="stockSymbol" />
    <BaseQuoteOverviewOption @select="handleSelectOption" />
    <q-btn @click="handleFetchQuoteOverview">Send</q-btn>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import BaseQuoteOverviewOption from './BaseQuoteOverviewOption.vue';
import { Payload } from '@/types';

export default defineComponent({
  name: 'BaseQuoteOverviewHeader',
  components: {
    BaseQuoteOverviewOption
  },
  data() {
    return {
      stockSymbol: '',
      stockExchange: '',
      modules: 'defaultKeyStatistics%2CassetProfile'
    };
  },
  methods: {
    handleSelectOption(value: string) {
      this.stockExchange = value;
    },
    handleFetchQuoteOverview() {
      const payload = {
        stockSymbol: this.stockSymbol,
        stockExchange: this.stockExchange,
        modules: this.modules
      } as Payload;

      this.$store.dispatch('overview/fetchQuoteOverview', payload);
    }
  }
});
</script>

<style scoped>
.header-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
