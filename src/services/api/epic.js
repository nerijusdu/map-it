import apiCall from './apiCall';

export default {
  saveEpic(epic, options) {
    epic.id = epic.id || null;
    return apiCall('/epics', {
      method: 'POST',
      body: JSON.stringify(epic)
    }, options);
  }
};
