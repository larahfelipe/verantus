<template>
  <DashboardTemplate />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import DashboardTemplate from '@/components/templates/DashboardTemplate.vue';

export default defineComponent({
  name: 'MainPage',
  components: {
    DashboardTemplate
  }
});
</script>
