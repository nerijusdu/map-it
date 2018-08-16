import { ErrorRequestHandler } from 'express';

export default ((err, req, res, next) => {
  console.log(err);
  res.status(500).send(err);
}) as ErrorRequestHandler;
