import 'reflect-metadata';
import { Connection, createConnection } from 'typeorm';
import { ORMConfigs } from '../config';
import { Category, Roadmap, Task, User } from '../models';

let con: Connection;
export let initPromise: Promise<void>;

export const init = () => {
  if (con) {
    return;
  }
  const config = ORMConfigs.find((x) => x.env === (process.env.NODE_ENV || '').trim()) || ORMConfigs[0];

  initPromise = createConnection({
    ...config,
    entities: [
      User,
      Roadmap,
      Task,
      Category
    ]
  })
    .then((data) => { con = data; })
    .catch((e) => console.log('connection failed', e));
};

export const close = () => con && con.isConnected
  ? con.close()
  : Promise.resolve();

export const connection = () => con;
