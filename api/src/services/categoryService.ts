import { Category, User } from '../models';
import { EntityServiceBase } from './entityServiceBase';
import roadmapService from './roadmapService';

class CategoryService extends EntityServiceBase<Category> {
  constructor(user?: User) {
    super(Category, user);
  }

  public save(category: Category) {
    const categoryInstance = new Category(category);

    return roadmapService(this.user)
      .getById(category.roadmapId)
      .then(() => super.save(categoryInstance));
  }
}

export default (user?: User) => new CategoryService(user);
