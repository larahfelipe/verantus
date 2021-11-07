import { createApp } from 'vue';

import { Quasar } from 'quasar';
import 'quasar/src/css/index.sass';

import App from '@/App.vue';
import store from '@/store';

const app = createApp(App);

app.use(Quasar);
app.use(store);

app.mount('#app');
