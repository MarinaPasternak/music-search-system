import SignUpForm from "../views/signUp/SignUpForm.vue";
import SignInForm from "../views/signIn/SignInForm.vue";
import NotFound from '../components/NotFoundedComponent.vue';

export const routes = [
    {
        path: '/',
        name: 'home-page',
        component: SignInForm
    }, {
        path: '/sign-in',
        name: 'sign-in',
        component: SignInForm
    }, {
        path: '/sign-up',
        name: 'sign-up',
        component: SignUpForm,
    }, {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFound
      }
];
