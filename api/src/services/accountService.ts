import shortid from 'shortid';
import validate from '../helpers/validate';
import { HttpError, User } from '../models';
import resources from '../resources';
import authService from './authService';
import { connection } from './databaseService';
import { EntityServiceBase } from './entityServiceBase';

const tokenList: any = {};
// TODO: implement logout to clear refresh token
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
          throw new HttpError(resources.Login_EmailIncorrect, 400);
        }
        const pass = await user.comparePasswords(password);
        if (!user || !pass) {
          throw new HttpError(resources.Login_PasswordIncorrect, 400);
        }
        return user;
      })
      .then((user) => {
        const refreshToken = this.generateLongToken();
        tokenList[refreshToken] = user.email;

        return {
            email: user.email,
            token: authService.createToken({ payload: user }),
            refreshToken
        };
      });
  }

  public verify(token?: string) {
    const tokenStr = (token || '').substring('Bearer '.length);

    const user = authService.getPayload(tokenStr);

    return {
      email: user.email,
      token: tokenStr
    };
  }

  public refresh(email: string, refreshToken: string) {
    if (tokenList[refreshToken] === email) {
      delete tokenList[refreshToken];

      return connection()
        .manager
        .findOne(User, { email })
        .then((user) => {
          if (!user) {
            throw new HttpError(resources.Generic_ErrorMessage, 500);
          }
          const newRefreshToken = this.generateLongToken();
          tokenList[newRefreshToken] = user.email;

          return {
              email: user.email,
              token: authService.createToken({ payload: user }),
              refreshToken: newRefreshToken
          };
        });
    }

    throw new HttpError(resources.Generic_PleaseLogin, 401);
  }

  public register(newUser: User) {
    return validate(newUser)
      .then(() => connection().manager.findOne(User, { email: newUser.email }))
      .then((existingUser) => {
        if (existingUser) {
          throw new HttpError(resources.Registration_EmailExists, 400);
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

  private generateLongToken() {
    return `${shortid.generate()}${shortid.generate()}${shortid.generate()}`;
  }
}

export default (user?: User) => new AccountService(user);
