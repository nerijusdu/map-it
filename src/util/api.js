import apiCall from './apiCall';

export default {
  login(userInfo, options) {
    return apiCall('/account/login', {
      method: 'POST',
      body: JSON.stringify(userInfo)
    }, options);
  },
  getUserInfo(options) {
    return apiCall('/account/verify', options);
  },
  getRoadmapById(id, options) {
    return apiCall(`/roadmaps/${id}`, options);
  },
  getRoadmaps(options) {
    return apiCall('/roadmaps', options);
  },
  register(userInfo, options) {
    return apiCall('/account/register', {
      method: 'POST',
      body: JSON.stringify(userInfo)
    }, options);
  },
  saveTask(task, options) {
    task.id = task.id || null;
    return apiCall('/tasks', {
      method: 'POST',
      body: JSON.stringify(task)
    }, options);
  },
  saveCategory(category, options) {
    category.id = category.id || null;
    return apiCall('/categories', {
      method: 'POST',
      body: JSON.stringify(category)
    }, options);
  }
};
