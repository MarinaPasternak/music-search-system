import { createApp, h } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './router/index.js';

import App from './App.vue';
import PrimeVue from 'primevue/config';

import 'bootstrap/dist/css/bootstrap.css';
import './assets/styles/main.scss';
import 'primevue/resources/themes/md-dark-deeppurple/theme.css';     
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css'

const RootComponent = {
    render() {
        return h(App);
    },
};

const app = createApp(RootComponent);

const router = createRouter({
    history: createWebHistory(),
    routes
});

app.config.productionTip = false;

app.use(PrimeVue);
app.use(router);

const vm = app.mount('#app');

export default vm;
