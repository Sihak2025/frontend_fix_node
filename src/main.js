import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
import router from './routes/AppRutes.js';
import { createPinia } from 'pinia';
import 'flowbite';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');