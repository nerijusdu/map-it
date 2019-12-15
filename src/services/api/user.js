import apiCall from './apiCall';

export default {
  findUsers(searchTerm, roadmapId, options) {
    return apiCall(`/users?searchTerm=${searchTerm}&roadmapId=${roadmapId}`, {
      method: 'GET'
    }, options);
  }
};
