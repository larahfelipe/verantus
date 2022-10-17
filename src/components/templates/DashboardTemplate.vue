<template>
  <div :class="dashboardTemplateStyles">
    <AppHeader @on-search="getStock" />
    <LoadingSpinner v-if="isFetching" />
    <AppBody v-else />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { useQuasar } from 'quasar';

import LoadingSpinner from '@/components/molecules/LoadingSpinner.vue';
import AppBody from '@/components/organisms/AppBody.vue';
import AppHeader from '@/components/organisms/AppHeader.vue';
import config from '@/config';
import type { StockPayload } from '@/types';

export default defineComponent({
  name: 'DashboardTemplate',
  components: {
    AppHeader,
    AppBody,
    LoadingSpinner
  },
  computed: {
    theme() {
      const currentTheme = this.$store.getters['theme/currentTheme'];

      const $q = useQuasar();
      currentTheme === 'dark' ? $q.dark.set(true) : $q.dark.set(false);

      return currentTheme;
    },
    dashboardTemplateStyles() {
      return this.theme === 'dark'
        ? 'app-wrapper app-wrapper__dark'
        : 'app-wrapper';
    },
    isFetching() {
      return this.$store.getters['stock/isFetching'];
    }
  },
  async created() {
    const hasStoredData = localStorage.getItem(config.appStorageKey);
    if (hasStoredData) return;

    const payload = {
      symbol: 'AAPL'
    } as StockPayload;

    this.$store.commit('stock/setIsFetching', true);
    await this.$store.dispatch('stock/fetchStockData', payload);
    await this.$store.dispatch('stock/fetchStockChart', payload);
    this.$store.commit('stock/setIsFetching', false);
  },
  methods: {
    async getStock(payload: StockPayload) {
      try {
        this.$store.commit('stock/setIsFetching', true);
        await this.$store.dispatch('stock/fetchStockData', payload);
        await this.$store.dispatch('stock/fetchStockChart', payload);
      } finally {
        this.$store.commit('stock/setIsFetching', false);
      }
    }
  }
});
</script>

<style scoped>
.app-wrapper {
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
}

.app-wrapper__dark {
  background-color: #18191c;
}

@media (max-width: 1550px) {
  .app-wrapper {
    width: 100%;
  }
}
</style>
