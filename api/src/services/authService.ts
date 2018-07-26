import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWTSecret } from '../.secret';
import { JWTAge } from '../config';
import { IUser } from '../models/user';

const getPayload = (token: string): IUser => {
  const payload = jwt.decode(token) as {[key: string]: any};
  if (!payload) {
    throw new Error('Invalid token');
  }
  return payload.data as IUser;
};

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

  const token = jwt.sign({ data: {
    _id: data.payload._id,
    email: data.payload.email
  } }, JWTSecret, { expiresIn: data.maxAge });

  return token;
};

const encryptPassword = (password: string) => {
  return bcrypt.genSalt(10)
    .then((salt) => bcrypt.hash(password, salt))
    .catch((err) => console.log(err));
};

const verifyPassword = (inputPass: string, encryptedPass: string) => {
  return bcrypt.compare(inputPass, encryptedPass);
};

export default {
  verifyToken,
  createToken,
  getPayload,
  verifyPassword,
  encryptPassword
};

interface ITokenData {
  payload: IUser;
  maxAge?: number;
}
