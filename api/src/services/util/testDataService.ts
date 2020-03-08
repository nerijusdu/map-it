import shortid from 'shortid';
import { Category, Roadmap, User } from '../../models';
import entityFactory from '../../tests/helpers/entityFactory';
import authService from './authService';
import { connection } from './databaseService';

const defaultPass: string = 'E2EsecurePassword';
export class TestDataService {
  private password: string;

  public async seed() {
    if (await this.hasSeededData()) { return; }

    this.password = (await authService.encryptPassword(defaultPass)) || defaultPass;

    const user = await this.seedUsers();
    const roadmap = await this.seedRoadmap(user);
    const categories = await this.seedCategories(roadmap);
    await this.seedTasks(roadmap, categories);
    await this.seedEpics(roadmap, [categories.category1, categories.category2]);
    await this.seedMilestones(roadmap);
  }

  private async seedMilestones(roadmap: Roadmap) {
    await entityFactory.createMilestone(roadmap.id, x => {
      x.title = 'E2E Milestone1';
      x.color = '#BADA55';
      x.date.setMonth(x.date.getMonth() + 1);
      return x;
    });
  }

  private async seedEpics(roadmap: Roadmap, categories: Category[]) {
    await entityFactory.createEpic(roadmap.id, x => {
      x.title = 'E2E Epic1';
      x.color = '#BADA55';
      x.categories = categories;
      return x;
    });
  }

  private async seedTasks(roadmap: Roadmap, { subCategory1 }: any) {
    await entityFactory.createTask(roadmap.id, x => {
      x.title = 'E2E Task1';
      return x;
    });
    await entityFactory.createTask(roadmap.id, x => {
      x.title = 'E2E Task2';
      x.categoryId = subCategory1.id;
      x.isCompleted = true;
      return x;
    });
  }

  private async seedCategories(roadmap1: Roadmap) {
    const category1 = await entityFactory.createCategory(roadmap1.id, x => {
      x.title = 'E2E Category1';
      x.color = '#BADA55';
      return x;
    });
    const category2 = await entityFactory.createCategory(roadmap1.id, x => {
      x.title = 'E2E Category2';
      x.color = '#BADA55';
      return x;
    });
    const subCategory1 = await entityFactory.createCategory(roadmap1.id, x => {
      x.title = 'E2E Sub-Category1';
      x.color = '#BADA55';
      x.parentCategoryId = category2.id;
      return x;
    });

    return {
      category1,
      category2,
      subCategory1
    };
  }

  private async seedRoadmap(user1: User) {
    const roadmap1 = await entityFactory.createRoadmap(user1.id, x => {
      x.title = 'E2E Roadmap1';
      x.startDate = new Date();
      x.startDate.setMonth(x.startDate.getMonth() - 1);
      return x;
    });

    return roadmap1;
  }

  private async seedUsers() {
    const userRepo = connection().getRepository(User);
    const user1 = await userRepo.save(new User({
      email: 'e2e-test@email.com',
      password: this.password,
      name: shortid.generate()
    }));

    return user1;
  }

  private async hasSeededData() {
    const user = await connection()
      .getRepository(User)
      .findOne({ email: 'e2e-test@email.com' });
    return !!user;
  }
}

export default () => new TestDataService();
