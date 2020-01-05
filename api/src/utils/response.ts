import { RequestHandler } from 'express';
import resources from '../resources';
import authService from '../services/util/authService';

export default (handler: RequestHandler, options: IResponseOptions = {}): RequestHandler => async (req, res, next) => {
  if (!options.isPublic) {
    const tokenStr = (req.headers.authorization || '').substring('Bearer '.length);
    try {
      const token: any = await authService.verifyToken(tokenStr);
      req.user = token.data;

      if (options.isAdmin && token.data.isAdmin !== true) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

    } catch (e) {
      return res.status(401).json({ message: resources.Generic_PleaseLogin });
    }
  }

  return Promise.resolve(handler(req, res, next)).catch(next);
};

interface IResponseOptions {
  isPublic?: boolean;
  isAdmin?: boolean;
}
