<template>
  <div class="loading-spinner-wrapper">
    <QSpinnerAudio color="green" size="3rem" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LoadingSpinner'
});
</script>

<style scoped>
.loading-spinner-wrapper {
  width: 100vw;
  height: calc(100% - 3rem);

  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
}
</style>
