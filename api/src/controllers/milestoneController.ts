import milestoneService from '../services/milestoneService';
import crudRouter from '../utils/crudRouter';

export default crudRouter(milestoneService, ['roadmap']);
