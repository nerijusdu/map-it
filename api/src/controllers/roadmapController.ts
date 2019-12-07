import crudRouter from '../helpers/crudRouter';
import roadmapService from '../services/roadmapService';

export const RoadmapController = crudRouter(roadmapService);
