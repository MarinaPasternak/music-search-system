import { createApp, h } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './router/index.js';
import store from './store/index.js'
import { auth } from './firebase/init.js'

import App from './App.vue';
import PrimeVue from 'primevue/config';
import Notifications from '@kyvg/vue3-notification'

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
app.use(Notifications)
app.use(router);
app.use(store);

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const isAuthenticated = auth.currentUser;
    if (requiresAuth && !isAuthenticated) {
        next("/");
    } else {
        next();
    }
});

const vm = app.mount('#app');

export default vm;
