import { ErrorRequestHandler } from 'express';
import { HttpError } from '../models';
import logger from '../utils/logger';

export default ((err, req, res, next) => {
  if (err instanceof HttpError) {
    res.status(err.status).send({
      message: err.message,
      data: err.data
    });
    next();
  } else {
    logger.error(err, {
      requestData: {
        url: req.url,
        params: req.params,
        query: req.query,
        body: req.body
      }
    });

    res.status(400).send({
      message: 'Something went wrong.'
    });
    next(err);
  }
}) as ErrorRequestHandler;
