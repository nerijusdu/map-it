import moment from 'moment';
import shortid from 'shortid';
import { JWTAge } from '../config';
import { HttpError, User } from '../models';
import resources from '../resources';
import validate from '../utils/validate';
import authService from './util/authService';
import { connection } from './util/databaseService';

class AccountService {
  constructor(private user?: User) {
  }

  public async login(email: string, password: string) {
    const user = await connection()
      .manager
      .findOne(User, { email }, { select: ['password', 'email', 'id', 'name', 'isAdmin'] });

    if (!user) {
      throw new HttpError(resources.Login_EmailIncorrect, 400);
    }
    const pass = await user.comparePasswords(password);
    if (!user || !pass) {
      throw new HttpError(resources.Login_PasswordIncorrect, 400);
    }

    const refreshToken = this.generateLongToken();
    const expiresAt = moment().add(JWTAge, 'seconds').toISOString();
    await connection().manager.update(User, { email }, { refreshToken });

    return {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      token: authService.createToken({ payload: user }),
      refreshToken,
      expiresAt
    };
  }

  public verify(token?: string) {
    const tokenStr = (token || '').substring('Bearer '.length);

    const user = authService.getPayload(tokenStr);

    return {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      token: tokenStr
    };
  }

  public async logout(email: string, refreshToken?: string) {
    if (!refreshToken || !email) {
      return;
    }
    await connection().manager.update(
      User,
      { email, refreshToken },
      { refreshToken: undefined }
    );
  }

  public async refresh(email: string, refreshToken?: string) {
    const user = await connection()
      .manager
      .findOne(User, { email }, { select: ['password', 'email', 'id', 'name', 'refreshToken', 'isAdmin'] });

    if (!user) {
      throw new HttpError(resources.Login_EmailIncorrect, 400);
    }

    if (user.refreshToken !== refreshToken) {
      throw new HttpError(resources.Generic_PleaseLogin, 401);
    }

    const newRefreshToken = this.generateLongToken();
    const expiresAt = moment().add(JWTAge, 'seconds').toISOString();
    await connection().manager.update(User, { email }, { refreshToken: newRefreshToken });

    return {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      token: authService.createToken({ payload: user }),
      refreshToken: newRefreshToken,
      expiresAt
    };
  }

  public async register(newUser: User) {
    await validate(newUser);
    const existingUser = await connection()
      .manager
      .findOne(User, { email: newUser.email });

    if (existingUser) {
      throw new HttpError(resources.Registration_EmailExists, 400);
    }
    const pass = await authService.encryptPassword(newUser.password!);

    if (!pass) {
      throw new Error('Password hashing failed');
    }
    newUser.password = pass;

    const res = await connection()
      .getRepository(User)
      .save(newUser);

    delete res.password;
    return res;
  }

  public async getById(id: number) {
    const user = await connection().manager.findOne(User, id);
    if (!user) {
      throw new HttpError(resources.Generic_EntityNotFound('User'), 400);
    }
    return user;
  }

  public async getByUniqueIdentifier(uniqueIdentifier: string) {
    const user = await connection()
      .manager
      .findOne(User, { where: { uniqueIdentifier }});

    if (!user) {
      throw new HttpError(resources.Generic_EntityNotFound('User'), 400);
    }

    return user;
  }

  public async getOrCreate(uniqueIdentifier: string, userInfo: IOtherUserInfo) {
    let userQuery = connection().createQueryBuilder<User>(User, 'user')
      .where('user.uniqueIdentifier = :uniqueIdentifier', { uniqueIdentifier });

    if (userInfo.email) {
      userQuery = userQuery.orWhere('user.email = :email', { email: userInfo.email });
    }

    const user = await userQuery.getOne();
    if (user) {
      return user;
    }

    const newUser = new User();
    newUser.uniqueIdentifier = uniqueIdentifier;
    newUser.email = userInfo.email;
    newUser.name = userInfo.name;

    const res = await connection()
      .getRepository(User)
      .save(newUser);

    return res;
  }

  public setUniqueIdentifier(userId: number, uniqueIdentifier: string) {
    return connection()
      .manager
      .update(User, { id: userId }, { uniqueIdentifier });
  }

  private generateLongToken() {
    return `${shortid.generate()}${shortid.generate()}${shortid.generate()}`;
  }
}

interface IOtherUserInfo {
  email: string;
  name: string;
}

export default (user?: User) => new AccountService(user);
