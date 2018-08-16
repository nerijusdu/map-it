import { RequestHandler } from 'express';
import auth from '../services/authService';

const publicUrls = [
  '/account/login',
  '/account/register'
];

export const verifyUser = ((req, res, next) => {
  if (publicUrls.find((x) => x === req.url)) {
    next();
    return;
  }

  const tokenStr = (req.headers.authorization || '').substring('Bearer '.length);

  auth.verifyToken(tokenStr)
    .then((token: any) => {
      req.user = token.data;
      next();
    })
    .catch((err) => {
      res
        .status(401)
        .json({ message: 'Please login.' });
    });
}) as RequestHandler;
