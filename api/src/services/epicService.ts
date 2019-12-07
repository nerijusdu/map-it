import { In } from 'typeorm';
import { Category, Epic, User } from '../models';
import { connection } from './databaseService';
import { EntityServiceBase } from './entityServiceBase';
import roadmapService from './roadmapService';

class EpicService extends EntityServiceBase<Epic> {
  constructor(user?: User) {
    super(Epic, user);
  }

  public async delete(id: number) {
    await connection().manager
      .update(Category, { userId: this.user!.id, epicId: id }, { epic: undefined });
    return super.delete(id);
  }

  public async saveWithCategories(epic: Epic, categoryIds?: number[]) {
    const epicInstance = new Epic(epic);
    epicInstance.userId = this.user!.id;

    await roadmapService(this.user).getById(epic.roadmapId);
    if (categoryIds) {
      const categories = await connection()
        .manager
        .find(Category, {
          where: {
            id: In(categoryIds),
            roadmapId: epic.roadmapId,
            parentCategoryId: null
          }
        });
      epicInstance.categories = categories;
    }
    return super.save(epicInstance);
  }
}

export default (user?: User) => new EpicService(user);
