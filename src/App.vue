<template>
  <div class="app-wrapper">
    <QuoteOverviewTemplate />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import QuoteOverviewTemplate from '@/components/templates/QuoteOverviewTemplate.vue';

export default defineComponent({
  name: 'App',
  components: {
    QuoteOverviewTemplate
  }
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;600&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Roboto Slab', sans-serif;
}

a {
  text-decoration: none;
  color: inherit;
}

.app-wrapper {
  width: 100vw;
  height: 100vh;

  display: grid;
  grid-template-columns: 1fr 4fr;
}
</style>
