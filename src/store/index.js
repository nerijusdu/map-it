import Vue from 'vue';
import Vuex from 'vuex';
import roadmap from './modules/roadmap';
import milestones from './modules/milestones';
import app from './modules/app';
import settings from './modules/settings';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    roadmap,
    milestones,
    app,
    settings
  },
  strict: debug
});
