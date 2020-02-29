import Vue from 'vue';
import Vuex from 'vuex';
import roadmap from './modules/roadmap';
import milestones from './modules/milestones';
import epics from './modules/epics';
import app from './modules/app';
import settings from './modules/settings';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    roadmap,
    milestones,
    epics,
    app,
    settings
  },
  strict: debug
});
