<template>
  <BaseSideMenu />
  <div class="quote-wrapper">
    <BaseQuoteOverviewHeader />
    <BaseQuoteOverviewBody />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import BaseQuoteOverviewBody from '@/components/base/BaseQuoteOverviewBody.vue';
import BaseQuoteOverviewHeader from '@/components/base/BaseQuoteOverviewHeader.vue';
import BaseSideMenu from '@/components/base/BaseSideMenu.vue';

export default defineComponent({
  name: 'QuoteOverviewTemplate',
  components: {
    BaseSideMenu,
    BaseQuoteOverviewHeader,
    BaseQuoteOverviewBody
  }
});
</script>

<style scoped>
.quote-wrapper {
  display: grid;
  grid-template-rows: 1fr 3fr;
}
</style>
