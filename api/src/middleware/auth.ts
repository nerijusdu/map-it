import { RequestHandler } from 'express';
import resources from '../resources';
import auth from '../services/authService';

const publicUrls = [
  '/account/login',
  '/account/register',
  '/account/refresh',
  '/health'
];

export const verifyUser = (async (req, res, next) => {
  if (publicUrls.find((x) => x === req.url)) {
    next();
    return;
  }

  const tokenStr = (req.headers.authorization || '').substring('Bearer '.length);

  try {
    const token: any = await auth.verifyToken(tokenStr);
    req.user = token.data;
    next();
  } catch (e) {
    res.status(401)
      .json({ message: resources.Generic_PleaseLogin });
  }
}) as RequestHandler;
