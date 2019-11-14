import store from '@/store';
import { loginUrl, publicUrls } from '../constants';

export default {
  authorizeRoutes: (to, from, next) => {
    if (publicUrls.includes(to.path)) {
      next();
    } else {
      next(!store.state.app.user.token ? loginUrl : undefined);
    }
  }
};
