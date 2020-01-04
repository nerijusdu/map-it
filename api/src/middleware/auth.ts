import { RequestHandler } from 'express';
import resources from '../resources';
import auth from '../services/authService';

const publicUrls = [
  /\/api\/account\/login(\?.*)?/,
  /\/api\/account\/register(\?.*)?/,
  /\/api\/account\/refresh(\?.*)?/,
  /\/api\/account\/logout(\?.*)?/,
  /\/api\/health(\?.*)?/,
  /\/swagger(.*)?/,
  /\/api\/notifications\/test(.*)?/
];
const adminUrls = [
  /\/api\/account\/iamadmin/,
  /\/api\/logs(.*)/
];
const staticContent = /\.(css|html|js|ico|png)|\/$/;

export const verifyUser = (async (req, res, next) => {
  if (publicUrls.find((x) => x.test(req.url)) ||
      staticContent.test(req.url)) {
    next();
    return;
  }

  const tokenStr = (req.headers.authorization || '').substring('Bearer '.length);

  try {
    const token: any = await auth.verifyToken(tokenStr);
    req.user = token.data;

    if (adminUrls.find((x) => x.test(req.url)) && token.data.isAdmin !== true) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    next();
  } catch (e) {
    res.status(401)
      .json({ message: resources.Generic_PleaseLogin });
  }
}) as RequestHandler;
