import apiCall from './apiCall';

export default {
  getRoadmapById(id, options) {
    return apiCall(`/roadmaps/${id}`, {}, options);
  },
  getRoadmaps(options) {
    return apiCall('/roadmaps', {}, options);
  },
  saveRoadmap(roadmap, options) {
    roadmap.id = roadmap.id || null;
    return apiCall('/roadmaps', {
      method: 'POST',
      body: JSON.stringify(roadmap)
    }, options);
  },
  deleteRoadmap(roadmapId, options) {
    return apiCall(`/roadmaps/${roadmapId}`, { method: 'DELETE' }, options);
  }
};
