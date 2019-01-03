import moment from 'moment';

const taskFromApi = task => ({
  id: task.id,
  categoryId: task.categoryId,
  description: task.description,
  title: task.title,
  startDate: moment(task.startDate),
  endDate: moment(task.endDate)
});

export default {
  taskFromApi
};
