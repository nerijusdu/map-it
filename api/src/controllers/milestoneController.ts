import milestoneService from '../services/milestoneService';
import crudRouter from '../utils/crudRouter';

export const MilestoneController = crudRouter(milestoneService, ['roadmap']);
