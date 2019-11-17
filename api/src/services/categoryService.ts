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

  public async update(id: number, updates: Category) {
    await super.getById(id);
    if (updates.roadmapId) {
      await roadmapService(this.user).getById(updates.roadmapId);
    }
    delete updates.id;
    delete updates.userId;
    return super.update(id, updates);
  }
}

export default (user?: User) => new CategoryService(user);
