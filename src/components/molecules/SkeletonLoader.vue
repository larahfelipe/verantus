<template>
  <div
    v-if="
      repeat &&
      Array.isArray(type) &&
      Array.isArray(width) &&
      Array.isArray(height)
    "
  >
    <q-skeleton
      v-for="(size, i) in width"
      :key="size"
      :type="type[i]"
      :width="size"
      :height="height[i]"
    />
  </div>
  <div v-else>
    <q-skeleton :type="type" :width="width" :height="height" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SkeletonLoader',
  props: {
    type: {
      type: [String, Array] as any,
      required: true
    },
    width: {
      type: [String, Array] as any,
      required: true
    },
    height: {
      type: [String, Array] as any,
      required: true
    },
    repeat: {
      type: Boolean,
      required: false
    }
  }
});
</script>
