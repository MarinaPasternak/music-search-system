import { createApp, h } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import { routes } from './router/index.js';
import { createRouter, createWebHistory } from 'vue-router';
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

export const app = createApp(RootComponent);

export const router = createRouter({
    history: createWebHistory(),
    routes
});

app.config.productionTip = false;

app.use(PrimeVue);
app.use(router);

const vm = app.mount('#app');

export default vm;
