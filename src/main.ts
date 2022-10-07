import { createApp } from 'vue';

import { Quasar } from 'quasar';
import iconSet from 'quasar/icon-set/bootstrap-icons';
import VueApexCharts from 'vue3-apexcharts';

import App from '@/App.vue';
import store from '@/store';

import '@quasar/extras/bootstrap-icons/bootstrap-icons.css';
import 'quasar/src/css/index.sass';

const app = createApp(App);

app.use(Quasar, {
  iconSet
});
app.use(VueApexCharts);
app.use(store);

app.mount('#app');
