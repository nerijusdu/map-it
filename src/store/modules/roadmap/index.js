import roadmapModule from './roadmap';
import categoryModule from './category';
import epicModule from './epic';
import taskModule from './task';

const roadmap = {
  namespaced: true,
  state: {
    ...roadmapModule.state,
    ...categoryModule.state,
    ...epicModule.state,
    ...taskModule.state,
  },
  getters: {
    ...roadmapModule.getters,
    ...categoryModule.getters,
    ...epicModule.getters,
    ...taskModule.getters,
  },
  actions: {
    ...roadmapModule.actions,
    ...categoryModule.actions,
    ...epicModule.actions,
    ...taskModule.actions,
  },
  mutations: {
    ...roadmapModule.mutations,
    ...categoryModule.mutations,
    ...epicModule.mutations,
    ...taskModule.mutations,
  }
};

export default roadmap;
