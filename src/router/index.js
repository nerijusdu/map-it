import Vue from 'vue';
import Router from 'vue-router';
import Timeline from '@/components/Timeline';
import Login from '@/components/Login';
import Navigation from '@/components/Navigation';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/timeline',
      name: 'Timeline',
      components: {
        default: Timeline,
        navigation: Navigation
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ],
});
