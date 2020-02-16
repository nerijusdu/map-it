import fetch, { RequestInit } from 'node-fetch';
import logger from './logger';

export default (url: string, opts: RequestInit) => 
  fetch(url, opts)
  .catch(err => {
    logger.error(err);
    return null;
  });
