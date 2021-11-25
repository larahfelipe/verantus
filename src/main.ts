import { createApp } from 'vue';

import { Quasar } from 'quasar';
import VueApexCharts from 'vue3-apexcharts';

import App from '@/App.vue';
import store from '@/store';

import 'quasar/src/css/index.sass';
import '@quasar/extras/material-icons/material-icons.css';

const app = createApp(App);

app.use(Quasar);
app.use(VueApexCharts);
app.use(store);

app.mount('#app');
