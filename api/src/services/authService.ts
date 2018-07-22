import jwt from 'jsonwebtoken';
import { JWTSecret } from '../.secret';
import { JWTAge } from '../config';
import user, { IUser } from '../models/user';

const verifyToken = (token: string | undefined) => {
  return new Promise<IUser>((resolve, reject) => {
    jwt.verify(token as string, JWTSecret, (err, decodedToken) => {
      if (err || !decodedToken) {
        return reject(err);
      }
      resolve(decodedToken as IUser);
    });
  });
};

const createToken = (data: ITokenData) => {
  if (!data.maxAge) {
    data.maxAge = JWTAge;
  }

  const token = jwt.sign({ data: data.payload }, JWTSecret, { expiresIn: data.maxAge });

  return token;
};

export default {
  verifyToken,
  createToken
};

interface ITokenData {
  payload: IUser;
  maxAge?: number;
}
