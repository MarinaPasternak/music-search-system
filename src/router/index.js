import SignUpForm from "../views/signUp/SignUpForm.vue";
import SignInForm from "../views/signIn/SignInForm.vue";
import SearchMusicComponent from "../views/searchMusic/SearchMusicComponent.vue";
import StatisticComponent from"../views/statistic/StatisticComponent.vue";
import NotFound from '../components/NotFoundedComponent.vue';

export const routes = [
    {
        path: '/',
        name: 'home-page',
        component: SearchMusicComponent
    }, {
        path: '/sign-in',
        name: 'sign-in',
        component: SignInForm
    }, {
        path: '/sign-up',
        name: 'sign-up',
        component: SignUpForm,
    }, {
        path: '/statistic',
        name: 'statistic',
        component: StatisticComponent,
    }, {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFound
      }
];
