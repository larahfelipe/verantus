<template>
  <div class="input-field-wrapper">
    <input
      v-model.trim="value"
      :class="inputFieldStyles"
      :placeholder="placeholder"
      :type="type"
      @change="onChange"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { InputFieldProps } from '@/types';

export default defineComponent({
  name: 'InputField',
  props: {
    type: {
      type: String,
      required: false,
      default: 'text'
    },
    placeholder: {
      type: String,
      required: false,
      default: ''
    }
  } as InputFieldProps,
  emits: ['on-change'],
  data() {
    return {
      value: ''
    };
  },
  computed: {
    theme() {
      return this.$store.getters['theme/currentTheme'];
    },
    inputFieldStyles() {
      return this.theme === 'dark'
        ? 'input-field input-field__dark'
        : 'input-field';
    }
  },
  methods: {
    onChange() {
      this.$emit('on-change', this.value.toUpperCase());
    }
  }
});
</script>

<style scoped>
.input-field-wrapper {
  width: 50%;

  display: flex;
  justify-content: center;
}

input {
  width: 100%;

  padding: 0.75rem 1rem;

  border-radius: 5px 0 0 5px;

  font-size: 16px;

  background-color: #ebedf3;

  transition: all 0.2s ease;
}

input::placeholder {
  color: #a5a4a4;
  font-style: italic;
}

.input-field__dark {
  color: #ddd;
  background-color: #202229;
}

input:hover:not(:focus) {
  border: 1px solid #cfcfcf;
}

.input-field__dark::placeholder {
  color: #555;
}

.input-field__dark:hover:not(:focus) {
  border: 1px solid #555;
}

input:focus {
  border: 1px solid #00ff80;
  transform: scale(1.05);
}
</style>
