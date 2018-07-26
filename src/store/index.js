import Vue from 'vue';
import Vuex from 'vuex';
import roadmap from './modules/roadmap';
import app from './modules/app';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    roadmap,
    app
  },
  strict: debug
});
