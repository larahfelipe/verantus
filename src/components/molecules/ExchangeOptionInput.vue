<template>
  <q-option-group v-model="selectedValue" color="green-6" :options="options" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ExchangeOptionInput',
  props: {
    options: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  emits: ['select-event'],
  data() {
    return {
      selectedValue: ''
    };
  },
  watch: {
    selectedValue(value: string) {
      this.$emit('select-event', value);
    }
  }
});
</script>
