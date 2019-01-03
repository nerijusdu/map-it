import Vue from 'vue';
import Router from 'vue-router';
import { authorizeRoutes } from '@/util/functions';
import Timeline from '@/components/Timeline';
import Login from '@/components/Login';
import Register from '@/components/Register';
import Navigation from '@/components/Navigation';
import Roadmaps from '@/components/Roadmaps';

Vue.use(Router);

const router = new Router({
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
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/roadmaps',
      name: 'Roadmaps',
      components: {
        default: Roadmaps,
        navigation: Navigation
      }
    }
  ],
});

router.beforeResolve(authorizeRoutes);

export default router;
