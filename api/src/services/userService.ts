import { User } from '../models';
import { connection } from './util/databaseService';

class UserService {
  constructor(private user: User) {}

  public async getAll(options?: IGetAllQuery) {
    options = options || {};
    const usersQuery = connection().createQueryBuilder(User, 'user')
      .leftJoin('user.sharedRoadmaps', 'ru')
      .where('user.id <> :userId', { userId: this.user.id });

    if (options.roadmapId) {
      usersQuery.andWhere(
        '(ru.roadmapId IS NULL OR ru.roadmapId <> :roadmapId)',
        { roadmapId: options.roadmapId }
      );
    }
    if (options.searchTerm) {
      usersQuery.andWhere(
        '(LOWER(user.name) LIKE LOWER(:term) OR LOWER(user.email) LIKE LOWER(:term))',
        { term: options.searchTerm + '%' }
      );
    }
    const users = await usersQuery.getMany();
    return users.map((x) => ({
      id: x.id,
      name: x.name,
      email: x.email
    }));
  }
}

interface IGetAllQuery {
  searchTerm?: string;
  roadmapId?: number;
}

export default (user: User) => new UserService(user);
