import apiCall from './apiCall';

export default {
  saveTask(task, options) {
    task.id = task.id || null;
    return apiCall('/tasks', {
      method: 'POST',
      body: JSON.stringify(task)
    }, options);
  }
};
