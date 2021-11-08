<template>
  <div class="side-divider">
    <TheLogo />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import TheLogo from '@/components/layout/TheLogo.vue';

export default defineComponent({
  name: 'BaseSideMenu',
  components: {
    TheLogo
  }
});
</script>

<style scoped>
.side-divider {
  width: 25rem;
  height: 100%;

  border-right: 1px solid #e7e7e7;
  background: #f0f2f7;
}
</style>
