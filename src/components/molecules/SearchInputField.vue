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

export default defineComponent({
  name: 'SearchInputField',
  props: {
    label: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
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
