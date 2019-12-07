import crudRouter from '../helpers/crudRouter';
import categoryService from '../services/categoryService';

export const CategoryController = crudRouter(categoryService, ['roadmap']);
