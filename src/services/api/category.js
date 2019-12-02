import apiCall from './apiCall';

export default {
  saveCategory(category, options) {
    category.id = category.id || null;
    category.parentCategoryId = category.parentCategoryId || null;
    return apiCall('/categories', {
      method: 'POST',
      body: JSON.stringify(category)
    }, options);
  }
};
