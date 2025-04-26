import './bootstrap';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';

axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

const app = createApp(App);
app.use(router);
app.mount('#app');
