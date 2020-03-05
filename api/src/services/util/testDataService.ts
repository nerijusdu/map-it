import shortid from 'shortid';
import { User } from '../../models';
import authService from './authService';
import { connection } from './databaseService';

const defaultPass: string = 'E2EsecurePassword';
export class TestDataService {
  private password: string;

  public async seed() {
    if (await this.hasSeededData()) { return; }

    this.password = (await authService.encryptPassword(defaultPass)) || defaultPass;

    await this.seedUsers();
  }

  private async seedUsers() {
    const userRepo = connection().getRepository(User);
    await userRepo.save(new User({
      email: 'e2e-test@email.com',
      password: this.password,
      name: shortid.generate()
    }));
  }

  private async hasSeededData() {
    const user = await connection()
      .getRepository(User)
      .findOne({ email: 'e2e-test@email.com' });
    return !!user;
  }
}

export default () => new TestDataService();
