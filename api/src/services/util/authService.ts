import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWTAge, JWTSecret } from '../../config';
import { HttpError } from '../../models';
import { User } from '../../models/user';
import resources from '../../resources';
import logger from '../../utils/logger';

const getPayload = (token: string): User => {
  const payload = jwt.decode(token) as {[key: string]: any};
  if (!payload) {
    throw new HttpError(resources.Generic_InvalidToken, 401);
  }
  return payload.data as User;
};

const verifyToken = (token: string | undefined) => {
  return new Promise<User>((resolve, reject) => {
    jwt.verify(token as string, JWTSecret, (err, decodedToken) => {
      if (err || !decodedToken) {
        return reject(err);
      }
      resolve(decodedToken as User);
    });
  });
};

const createToken = (data: ITokenData) => {
  if (!data.maxAge) {
    data.maxAge = JWTAge;
  }

  const token = jwt.sign({ data: {
    id: data.payload.id,
    email: data.payload.email,
    isAdmin: data.payload.isAdmin,
    name: data.payload.name
  } }, JWTSecret, { expiresIn: data.maxAge });

  return token;
};

const encryptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt).catch((err) => { logger.error(err); });
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
  payload: User;
  maxAge?: number;
}
