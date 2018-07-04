// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VModal from 'vue-js-modal';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import App from './App';
import router from './router';
import store from './store';
import './assets/shared.css';
import './assets/shared.scss';

Vue.config.productionTip = false;

Vue.use(VModal);
Vue.use(VueMaterial);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});
