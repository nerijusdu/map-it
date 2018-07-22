import { NextFunction, RequestHandler, Response } from 'express';
import { PublicRequest } from '../models/publicRequest';
import { IUser } from '../models/user';
import auth from '../services/authService';

const publicUrls = [
  '/account/login',
  '/account/register'
];

export const verifyUser = ((req: PublicRequest, res: Response, next: NextFunction) => {
  if (publicUrls.find((x) => x === req.url)) {
    next();
    return;
  }

  const tokenStr = (req.headers.authorization || '').substring('Bearer '.length);

  auth.verifyToken(tokenStr)
    .then((token: IUser) => {
      req.user = token;
      next();
    })
    .catch((err) => {
      res
        .status(401)
        .json({ message: 'Please login.' });
    });
}) as RequestHandler;
