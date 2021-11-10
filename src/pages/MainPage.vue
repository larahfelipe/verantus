<template>
  <StockOverviewTemplate />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import StockOverviewTemplate from '@/components/templates/StockOverviewTemplate.vue';

export default defineComponent({
  name: 'MainPage',
  components: {
    StockOverviewTemplate
  }
});
</script>
