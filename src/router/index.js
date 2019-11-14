import Vue from 'vue';
import Router from 'vue-router';
import authService from '../services/authService';
import Timeline from '../components/Timeline';
import Login from '../components/Login';
import Register from '../components/Register';
import Navigation from '../components/Navigation';
import RoadmapList from '../components/RoadmapList';
import RoadmapPreview from '../components/RoadmapPreview';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/timeline'
    },
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
      name: 'RoadmapList',
      components: {
        default: RoadmapList,
        navigation: Navigation
      }
    },
    {
      path: '/roadmaps/:id',
      name: 'RoadmapPreview',
      components: {
        default: RoadmapPreview,
        navigation: Navigation
      }
    }
  ],
});

router.beforeResolve(authService.authorizeRoutes);

export default router;
