import Vue from 'vue';
import Router from 'vue-router';
import authService from '../services/authService';

const Timeline = () => import('../components/Timeline/Index');
const Login = () => import('../components/Login');
const Register = () => import('../components/Register');
const Navigation = () => import('../components/Navigation');
const RoadmapList = () => import('../components/RoadmapList');
const RoadmapPreview = () => import('../components/RoadmapPreview');
const Logs = () => import('../components/Logs');

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/timeline'
    },
    {
      path: '/timeline',
      components: {
        default: Timeline,
        navigation: Navigation
      }
    },
    {
      path: '/timeline/:id',
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
    },
    {
      path: '/logs',
      name: 'Logs',
      components: {
        default: Logs,
        navigation: Navigation
      }
    }
  ],
});

router.beforeResolve(authService.authorizeRoutes);

export default router;
