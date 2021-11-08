<template>
  <MainPage />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import MainPage from '@/pages/MainPage.vue';

export default defineComponent({
  name: 'App',
  components: {
    MainPage
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

body {
  color: #353a45;
}

a {
  text-decoration: none;
  color: inherit;
}
</style>
