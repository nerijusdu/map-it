import roadmapModule from './roadmap';
import taskModule from './task';

const roadmap = {
  namespaced: true,
  state: {
    ...roadmapModule.state,
    ...taskModule.state,
  },
  getters: {
    ...roadmapModule.getters,
    ...taskModule.getters,
  },
  actions: {
    ...roadmapModule.actions,
    ...taskModule.actions,
  },
  mutations: {
    ...roadmapModule.mutations,
    ...taskModule.mutations,
  }
};

export default roadmap;
