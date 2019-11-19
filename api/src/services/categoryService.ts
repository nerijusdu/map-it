import { Category, User } from '../models';
import { EntityServiceBase } from './entityServiceBase';
import roadmapService from './roadmapService';

class CategoryService extends EntityServiceBase<Category> {
  constructor(user?: User) {
    super(Category, user);
  }

  public async save(category: Category) {
    const categoryInstance = new Category(category);
    categoryInstance.userId = this.user!.id;

    await roadmapService(this.user).getById(category.roadmapId);
    return super.save(categoryInstance);
  }
}

export default (user?: User) => new CategoryService(user);
