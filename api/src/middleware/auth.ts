import { RequestHandler } from 'express';
import resources from '../resources';
import auth from '../services/authService';

const publicUrls = [
  '/api/account/login',
  '/api/account/register',
  '/api/account/refresh',
  '/api/account/logout',
  '/api/health',
  '/swagger'
];
const staticContent = /\.(css|html|js|ico|png)|\/$/;

export const verifyUser = (async (req, res, next) => {
  if (publicUrls.find((x) => x === req.url) || staticContent.test(req.url)) {
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
