<template>
  <div v-if="options" class="select-input-wrapper">
    <select
      v-model="selectValue"
      :class="selectInputStyles"
      :disabled="disabled"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { SelectInputProps, SelectOption } from '@/types';

export default defineComponent({
  name: 'SelectInput',
  props: {
    options: {
      type: Array,
      required: true,
      default: [] as SelectOption[]
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  } as SelectInputProps,
  emits: ['on-change'],
  computed: {
    theme() {
      return this.$store.getters['theme/currentTheme'];
    },
    selectInputStyles() {
      return this.theme === 'dark'
        ? 'select-input select-input__dark'
        : 'select-input';
    },
    selectValue: {
      get() {
        return this.options;
      },
      set(value: string) {
        this.$emit('on-change', value);
      }
    }
  }
});
</script>

<style scoped>
.select-input-wrapper {
  width: 50%;
}

.select-input {
  width: 100%;

  padding: 0.75rem 1rem;

  border-radius: 0 5px 5px 0;

  font-size: 16px;

  border: 1px solid #ededf3;

  background-color: #ebedf3;

  transition: all 0.2s ease;
}

.select-input__dark {
  color: #ddd;

  border: 1px solid #202229;

  background-color: #202229;
}

select:hover:not(:focus) {
  border: 1px solid #cfcfcf;
}

.select-input__dark:hover:not(:focus) {
  border: 1px solid #555;
}

select:focus {
  border: 1px solid #00ff80;
  transform: scale(1.05);
}
</style>
