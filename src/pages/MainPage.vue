<template>
  <div class="app-wrapper">
    <QuoteOverviewTemplate />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import QuoteOverviewTemplate from '@/components/templates/QuoteOverviewTemplate.vue';

export default defineComponent({
  name: 'MainPage',
  components: {
    QuoteOverviewTemplate
  }
});
</script>

<style scoped>
.app-wrapper {
  width: 100vw;
  height: 100vh;

  display: grid;
  grid-template-columns: 1fr 4fr;
}
</style>
