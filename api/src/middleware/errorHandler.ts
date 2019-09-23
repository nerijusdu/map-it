import { ErrorRequestHandler } from 'express';
import { HttpError } from '../models';

export default ((err, req, res, next) => {
  if (err instanceof HttpError) {
    res.status(err.status).send({
      message: err.message,
      data: err.data
    });
    next();
  } else {
    res.status(400).send({
      message: 'Something went wrong.'
    });
    next(err);
  }
}) as ErrorRequestHandler;
