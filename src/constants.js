export const datePreviewFormat = 'DD MMMM YYYY';

export const roadmapMonthFormat = 'MMM YYYY';

export const apiUrl = process.env.API_URL || 'http://localhost:8081/api';

export const loginUrl = '/login';

export const publicUrls = [
  loginUrl,
  '/register'
];

export const adminUrls = [
  '/logs'
];

export const errorTime = 5 * 1000;

export const validationRules = {
  descriptionLength: 2000
};
