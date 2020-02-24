import { Category, Task, User } from '../models';
import { RoadmapEntityServiceBase } from './roadmapEntityServiceBase';
import roadmapService from './roadmapService';
import { connection } from './util/databaseService';

class CategoryService extends RoadmapEntityServiceBase<Category> {
  constructor(user: User) {
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

  public getByName(name: string) {
    return this.getAllQuery()
      .andWhere('LOWER(entity.title) LIKE LOWER(:title)', { title: `${name}%`})
      .getOne();
  }

  public async getForRoadmap(roadmapId: number) {
    return this.getAllQuery()
      .andWhere('roadmap.id = :roadmapId', { roadmapId })
      .getMany();
  }
}

export default (user: User) => new CategoryService(user);
