import { Category, User, Task } from '../models';
import { connection } from './databaseService';
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

    if (!category.parentCategoryId) {
      return super.save(categoryInstance);
    }

    await this.getById(category.parentCategoryId);
    const subCategories: Category[] = await connection().manager
      .find(Category, {
        where: {
          userId: this.user!.id,
          parentCategoryId: category.parentCategoryId
        }
      });

    const result = await super.save(categoryInstance);
    if (subCategories.length === 0) {
      await connection().manager
        .update(Task, {
          categoryId: category.parentCategoryId,
          userId: this.user!.id
        }, {
          categoryId: result.id
        });
    }

    return result;
  }
}

export default (user?: User) => new CategoryService(user);
