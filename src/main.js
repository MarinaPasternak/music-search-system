import { createApp, h } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './router/index.js';

import App from './App.vue';
import { initializeApp } from "firebase/app";
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

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASURMENT_ID
};

initializeApp(firebaseConfig);

app.config.productionTip = false;

app.use(PrimeVue);
app.use(router);

const vm = app.mount('#app');

export default vm;
