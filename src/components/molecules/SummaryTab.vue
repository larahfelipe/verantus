<template>
  <div class="summary-wrapper">
    <p>{{ text }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { SummaryTabProps } from '@/types';

export default defineComponent({
  name: 'SummaryTab',
  props: {
    text: {
      type: String,
      required: true
    }
  } as SummaryTabProps
});
</script>

<style scoped>
.summary-wrapper {
  width: 75%;
  margin: 2.5rem auto;

  display: flex;
  justify-content: center;

  line-height: 30px;
  font-size: 16px;
}
</style>
