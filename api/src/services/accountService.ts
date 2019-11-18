import moment from 'moment';
import shortid from 'shortid';
import { JWTAge } from '../config';
import validate from '../helpers/validate';
import { HttpError, User } from '../models';
import resources from '../resources';
import authService from './authService';
import { connection } from './databaseService';
import { EntityServiceBase } from './entityServiceBase';

const tokenList: any = {};

class AccountService extends EntityServiceBase<User> {
  constructor(user?: User) {
    super(User, user);
  }

  public async login(email: string, password: string) {
    const user = await connection()
      .manager
      .findOne(User, { email });

    if (!user) {
      throw new HttpError(resources.Login_EmailIncorrect, 400);
    }
    const pass = await user.comparePasswords(password);
    if (!user || !pass) {
      throw new HttpError(resources.Login_PasswordIncorrect, 400);
    }

    const refreshToken = this.generateLongToken();
    tokenList[refreshToken] = user.email;
    const expiresAt = moment().add(JWTAge, 'seconds').toISOString();

    return {
        email: user.email,
        token: authService.createToken({ payload: user }),
        refreshToken,
        expiresAt
    };
  }

  public verify(token?: string) {
    const tokenStr = (token || '').substring('Bearer '.length);

    const user = authService.getPayload(tokenStr);

    return {
      email: user.email,
      token: tokenStr
    };
  }

  public logout(refreshToken?: string) {
    if (!refreshToken) {
      return;
    }

    if (tokenList[refreshToken]) {
      delete tokenList[refreshToken];
    }
  }

  public async refresh(email: string, refreshToken: string) {
    if (tokenList[refreshToken] === email) {
      delete tokenList[refreshToken];

      const user = await connection()
        .manager
        .findOne(User, { email });

      if (!user) {
        throw new HttpError(resources.Generic_ErrorMessage, 400);
      }
      const newRefreshToken = this.generateLongToken();
      tokenList[newRefreshToken] = user.email;
      const expiresAt = moment().add(JWTAge, 'seconds').toISOString();

      return {
          email: user.email,
          token: authService.createToken({ payload: user }),
          refreshToken: newRefreshToken,
          expiresAt
      };
    }

    throw new HttpError(resources.Generic_PleaseLogin, 401);
  }

  public async register(newUser: User) {
    await validate(newUser);
    const existingUser = await connection()
      .manager
      .findOne(User, { email: newUser.email });

    if (existingUser) {
      throw new HttpError(resources.Registration_EmailExists, 400);
    }
    const pass = await authService.encryptPassword(newUser.password);

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

  private generateLongToken() {
    return `${shortid.generate()}${shortid.generate()}${shortid.generate()}`;
  }
}

export default (user?: User) => new AccountService(user);
