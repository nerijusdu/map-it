import apiCall from './apiCall';

export default {
  saveMilestone(milestone, options) {
    milestone.id = milestone.id || null;
    return apiCall('/milestones', {
      method: 'POST',
      body: JSON.stringify(milestone)
    }, options);
  }
};
