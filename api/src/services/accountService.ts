import validate from '../helpers/validate';
import { HttpError, User } from '../models';
import authService from './authService';
import { connection } from './databaseService';
import { EntityServiceBase } from './entityServiceBase';

class AccountService extends EntityServiceBase<User> {
  constructor(user?: User) {
    super(User, user);
  }

  public login(email: string, password: string) {
    return connection()
      .manager
      .findOne(User, { email })
      .then(async (user) => {
        if (!user) {
          throw new HttpError('Email is incorrect.', 400);
        }
        const pass = await user.comparePasswords(password);
        if (!user || !pass) {
          throw new HttpError('Password is incorrect.', 400);
        }
        return user;
      })
      .then((user) => ({
          email: user.email,
          token: authService.createToken({ payload: user })
      }));
  }

  public verify(token?: string) {
    const tokenStr = (token || '').substring('Bearer '.length);

    const user = authService.getPayload(tokenStr);

    return {
      email: user.email,
      token: tokenStr
    };
  }

  public register(newUser: User) {
    return validate(newUser)
      .then(() => connection().manager.findOne(User, { email: newUser.email }))
      .then((existingUser) => {
        if (existingUser) {
          throw new HttpError('User with this email already exists', 400);
        }
        return authService.encryptPassword(newUser.password);
      })
      .then((pass) => {
        if (!pass) {
          throw new Error('Password hashing failed');
        }
        newUser.password = pass;

        return connection()
          .getRepository(User)
          .save(newUser);
      })
      .then((res) => {
        delete res.password;
        return res;
      });
  }
}

export default (user?: User) => new AccountService(user);
