import crudRouter from '../helpers/crudRouter';
import milestoneService from '../services/milestoneService';

export const MilestoneController = crudRouter(milestoneService, ['roadmap']);
