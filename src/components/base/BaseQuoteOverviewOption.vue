<template>
  <q-option-group color="primary" :options="options" v-model="selectedValue" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BaseQuoteOverviewOption',
  emits: ['select'],
  data() {
    return {
      selectedValue: ''
    };
  },
  watch: {
    selectedValue(value: string) {
      this.$emit('select', value);
    }
  },
  computed: {
    options() {
      return [
        { label: 'US Stock', value: '' },
        { label: 'BR Stock', value: '.SA' }
      ];
    }
  }
});
</script>
