<template>
  <q-input
    v-model="enteredValue"
    clearable
    type="text"
    color="green-6"
    clear-icon="close"
    :label="label"
    :loading="loading"
    @change="handleChange"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { SearchInputFieldProps } from '@/types';

export default defineComponent({
  name: 'SearchInputField',
  props: {
    label: {
      type: String,
      required: false,
      default: ''
    },
    loading: {
      type: Boolean,
      required: false,
      default: false
    }
  } as SearchInputFieldProps,
  emits: ['change-event'],
  data() {
    return {
      enteredValue: ''
    };
  },
  methods: {
    handleChange() {
      this.$emit('change-event', this.enteredValue.trim());
    }
  }
});
</script>
