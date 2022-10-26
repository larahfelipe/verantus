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
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&display=swap');

* {
  -webkit-appearance: none;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 88.5%;
}

html,
body {
  font-family: 'Inter Tight', sans-serif !important;
}

body,
input,
button,
select,
textarea {
  border: none;
  outline: inherit;

  color: #353a45;
  background-color: #f2f3f5;
}

input,
select {
  border-color: transparent;
}

button,
a {
  cursor: pointer;

  color: inherit;
  text-decoration: none;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track,
::-webkit-scrollbar-thumb {
  border-radius: 5px;
}

::-webkit-scrollbar-track {
  background-color: #f2f3f5;
}

::-webkit-scrollbar-thumb {
  background-color: #d1d2d6;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #adadb1;
}
</style>
