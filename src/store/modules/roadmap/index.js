import roadmapModule from './roadmap';
import categoryModule from './category';
import milestoneModule from './milestone';
import taskModule from './task';

const roadmap = {
  namespaced: true,
  state: {
    ...roadmapModule.state,
    ...categoryModule.state,
    ...milestoneModule.state,
    ...taskModule.state,
  },
  getters: {
    ...roadmapModule.getters,
    ...categoryModule.getters,
    ...milestoneModule.getters,
    ...taskModule.getters,
  },
  actions: {
    ...roadmapModule.actions,
    ...categoryModule.actions,
    ...milestoneModule.actions,
    ...taskModule.actions,
  },
  mutations: {
    ...roadmapModule.mutations,
    ...categoryModule.mutations,
    ...milestoneModule.mutations,
    ...taskModule.mutations,
  }
};

export default roadmap;
