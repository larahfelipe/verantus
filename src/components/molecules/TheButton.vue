<template>
  <button :class="buttonStyles" :type="type" :disabled="disabled">
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { ButtonProps } from '@/types';

export default defineComponent({
  name: 'TheButton',
  props: {
    type: {
      type: String,
      required: false,
      default: 'button'
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  } as ButtonProps,
  computed: {
    theme() {
      return this.$store.getters['theme/currentTheme'];
    },
    buttonStyles() {
      return this.theme === 'dark' ? 'button button__dark' : 'button';
    }
  }
});
</script>

<style scoped>
.button {
  padding: 0.75rem 1rem;

  border: 1px solid #ddd;
  border-radius: 10px;

  background-color: #ebedf3;

  transition: all 0.2s ease;
}

.button__dark {
  border: 1px solid #2e2e2e;

  background-color: #202229;
  color: #fff;
}

.button:hover {
  filter: brightness(0.95);
}

.button__dark:hover {
  filter: brightness(1.2);
}

.button:active:not(:disabled) {
  transform: scale(0.9);
}
</style>
