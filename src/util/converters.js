import moment from 'moment';

const taskFromApi = task => ({
  id: task.id,
  categoryId: task.categoryId,
  description: task.description,
  title: task.title,
  startDate: moment(task.startDate),
  endDate: moment(task.endDate)
});

const roadmapFromApi = roadmap => ({
  id: roadmap.id,
  title: roadmap.title,
  description: roadmap.description,
  startDate: moment(roadmap.startDate),
  endDate: moment(roadmap.endDate),
  createdDate: moment(roadmap.createdOn)
});

export default {
  taskFromApi,
  roadmapFromApi
};
