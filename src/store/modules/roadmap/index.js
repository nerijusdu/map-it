import roadmapModule from './roadmap';
import categoryModule from './category';
import taskModule from './task';

const roadmap = {
  namespaced: true,
  state: {
    ...roadmapModule.state,
    ...categoryModule.state,
    ...taskModule.state,
  },
  getters: {
    ...roadmapModule.getters,
    ...categoryModule.getters,
    ...taskModule.getters,
  },
  actions: {
    ...roadmapModule.actions,
    ...categoryModule.actions,
    ...taskModule.actions,
  },
  mutations: {
    ...roadmapModule.mutations,
    ...categoryModule.mutations,
    ...taskModule.mutations,
  }
};

export default roadmap;
