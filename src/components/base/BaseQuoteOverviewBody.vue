<template>
  <div v-if="!error && !isLoading && isFetched">
    {{ JSON.stringify(quoteOverview) }}
  </div>
  <div v-else>{{ error }}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

import { QuoteOverview } from '@/types';

export default defineComponent({
  name: 'BaseQuoteOverviewBody',
  computed: {
    quoteOverview() {
      return this.$store.getters['overview/quoteOverview'] as QuoteOverview;
    },
    ...mapGetters('overview', {
      isLoading: 'isLoading',
      isFetched: 'isFetched',
      error: 'error'
    })
  }
});
</script>
