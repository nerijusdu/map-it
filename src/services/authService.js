import store from '@/store';
import { loginUrl, publicUrls } from '../constants';

export default {
  authorizeRoutes: (to, from, next) => {
    if (publicUrls.includes(to.path)) {
      next();
    } else {
      store
        .dispatch('app/getToken')
        .then(token => next(!token ? loginUrl : undefined));
    }
  }
};
