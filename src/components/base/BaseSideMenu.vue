<template>
  <div class="side-divider">
    <Logo />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Logo from '@/components/layout/Logo.vue';

export default defineComponent({
  name: 'BaseSideMenu',
  components: {
    Logo
  }
});
</script>

<style scoped>
.side-divider {
  width: 25rem;
  height: 100%;

  border-right: 1px solid #e7e7e7;
  background-color: #f0f2f7;
}
</style>
