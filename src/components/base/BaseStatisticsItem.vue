<template>
  <div class="statistics-item-wrapper">
    <span>
      {{ longLabel }}
      <span class="statistics-item-subtitle">{{ shortLabel }}</span>
    </span>
    <b>{{ parsedValue }}</b>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BaseStatisticsItem',
  props: {
    longLabel: {
      type: String,
      required: true
    },
    shortLabel: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      required: true
    }
  },
  computed: {
    parsedValue() {
      return this.value === undefined ? 'N/A' : (this.value as string);
    }
  }
});
</script>

<style scoped>
.statistics-item-wrapper {
  width: 75%;

  display: flex;
  justify-content: space-between;

  border-bottom: 1px solid #ccc;

  line-height: 38px;
}

.statistics-item-subtitle {
  color: #838383;
}
</style>
