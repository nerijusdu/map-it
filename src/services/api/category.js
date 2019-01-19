import apiCall from './apiCall';

export default {
  saveCategory(category, options) {
    category.id = category.id || null;
    return apiCall('/categories', {
      method: 'POST',
      body: JSON.stringify(category)
    }, options);
  }
};
