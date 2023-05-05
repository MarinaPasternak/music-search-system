import SignUpForm from "../views/signUp/SignUpForm.vue";
import SignInForm from "../views/signIn/SignInForm.vue";
import HomeComponent from "../views/homePage/Home";
import StatisticComponent from"../views/statistic/StatisticComponent.vue";
import TrackPage from '../views/trackPage/TrackPage.vue';
import NotFound from '../components/NotFoundedComponent.vue';

export const routes = [
    {
        path: '/',
        name: 'home-page',
        component: HomeComponent
    }, {
        path: '/sign-in',
        name: 'sign-in',
        component: SignInForm
    }, {
        path: '/sign-up',
        name: 'sign-up',
        component: SignUpForm,
    },{
        path: '/song/:artist/:song',
        name: 'song',
        component: TrackPage
      }, {
        path: '/statistic',
        name: 'statistic',
        component: StatisticComponent,
        meta: { requiresAuth: true }
    }, {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFound
      }
];
