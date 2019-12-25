import store from '@/store';
import { loginUrl, publicUrls, adminUrls } from '../constants';

export default {
  authorizeRoutes: (to, from, next) => {
    if (publicUrls.includes(to.path)) {
      next();
    } else if (adminUrls.includes(to.path)) {
      next(!store.state.app.user.isAdmin ? '/' : undefined);
    } else {
      next(!store.state.app.user.token ? loginUrl : undefined);
    }
  }
};
