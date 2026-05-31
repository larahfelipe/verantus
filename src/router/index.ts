import { createRouter, createWebHistory } from 'vue-router';

import DashboardLayout from '@/layouts/DashboardLayout.vue';
import DashboardPage from '@/pages/DashboardPage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: DashboardLayout,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardPage
        }
      ]
    }
  ]
});

export default router;
