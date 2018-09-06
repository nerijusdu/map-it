import { ErrorRequestHandler } from 'express';
import { HttpError } from '../models';

export default ((err, req, res, next) => {
  if (err instanceof HttpError) {
    res.status(err.status).send({ message: err.message });
    next();
  } else {
    res.status(500).send(err);
    next(err);
  }
}) as ErrorRequestHandler;
