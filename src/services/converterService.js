import moment from 'moment';

// TODO: i probably dont need this
export default {
  taskFromApi: task => ({
    id: task.id,
    categoryId: task.categoryId,
    description: task.description,
    title: task.title,
    startDate: moment(task.startDate),
    endDate: moment(task.endDate)
  }),
  roadmapFromApi: roadmap => ({
    id: roadmap.id,
    title: roadmap.title,
    description: roadmap.description,
    startDate: moment(roadmap.startDate),
    endDate: moment(roadmap.endDate),
    createdDate: moment(roadmap.createdOn)
  })
};
