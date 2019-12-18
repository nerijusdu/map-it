import { RequestHandler } from 'express';

export default (handler: RequestHandler): RequestHandler => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);
