import categoryService from '../services/categoryService';
import crudRouter from '../utils/crudRouter';

export default crudRouter(categoryService, ['roadmap']);
