<template>
  <div :class="dashboardTemplateStyles">
    <AppHeader @on-search="getStockData" />
    <AppBody />
  </div>
</template>

<script>
import { defineComponent } from 'vue';

import { useQuasar } from 'quasar';

import AppBody from '@/components/organisms/AppBody.vue';
import AppHeader from '@/components/organisms/AppHeader.vue';

export default defineComponent({
  name: 'DashboardTemplate',
  components: {
    AppHeader,
    AppBody
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
    }
  },
  methods: {
    getStockData(payload) {
      console.log(payload);
      // this.$store.dispatch('stock/fetchStockData', payload);
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
</style>
