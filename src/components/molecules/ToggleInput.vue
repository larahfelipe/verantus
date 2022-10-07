<template>
  <div class="toggle-input-wrapper">
    <QToggle
      v-model="isToggled"
      :unchecked-icon="uncheckedIcon"
      :checked-icon="checkedIcon"
      :size="size"
      :color="color"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { ToggleInputProps } from '@/types';

export default defineComponent({
  name: 'ToggleInput',
  props: {
    value: {
      type: Boolean,
      required: false,
      default: false
    },
    uncheckedIcon: {
      type: String,
      required: false,
      default: ''
    },
    checkedIcon: {
      type: String,
      required: false,
      default: ''
    },
    size: {
      type: String,
      required: false,
      default: 'md'
    },
    color: {
      type: String,
      required: false,
      default: 'green'
    }
  } as ToggleInputProps,
  emits: ['on-change'],
  computed: {
    isToggled: {
      get() {
        return this.value;
      },
      set(value: boolean) {
        this.$emit('on-change', value);
      }
    }
  }
});
</script>

<style scoped>
.toggle-input-wrapper {
  width: 10%;

  display: flex;
  justify-content: flex-end;

  margin-right: 1.5rem;
}
</style>
