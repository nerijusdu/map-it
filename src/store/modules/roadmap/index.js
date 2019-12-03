import roadmapModule from './roadmap';
import categoryModule from './category';
import milestoneModule from './milestone';
import epicModule from './epic';
import taskModule from './task';

const roadmap = {
  namespaced: true,
  state: {
    ...roadmapModule.state,
    ...categoryModule.state,
    ...milestoneModule.state,
    ...epicModule.state,
    ...taskModule.state,
  },
  getters: {
    ...roadmapModule.getters,
    ...categoryModule.getters,
    ...milestoneModule.getters,
    ...epicModule.getters,
    ...taskModule.getters,
  },
  actions: {
    ...roadmapModule.actions,
    ...categoryModule.actions,
    ...milestoneModule.actions,
    ...epicModule.actions,
    ...taskModule.actions,
  },
  mutations: {
    ...roadmapModule.mutations,
    ...categoryModule.mutations,
    ...milestoneModule.mutations,
    ...epicModule.mutations,
    ...taskModule.mutations,
  }
};

export default roadmap;
