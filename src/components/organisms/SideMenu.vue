<template>
  <div class="side-menu-wrapper">
    <TheLogo />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import TheLogo from '@/components/molecules/TheLogo.vue';

export default defineComponent({
  name: 'SideMenu',
  components: {
    TheLogo
  }
});
</script>

<style scoped>
.side-menu-wrapper {
  width: 25rem;
  height: 100%;

  border-right: 1px solid #e7e7e7;
  background: #f0f2f7;
}
</style>
