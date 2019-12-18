import categoryService from '../services/categoryService';
import crudRouter from '../utils/crudRouter';

export const CategoryController = crudRouter(categoryService, ['roadmap']);
