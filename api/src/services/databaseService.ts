import 'reflect-metadata';
import { Connection, createConnection } from 'typeorm';
import { ORMConfigs } from '../config';
import {
  Category,
  Epic,
  Milestone,
  Roadmap,
  RoadmapUser,
  Task,
  User,
  UserNotification
} from '../models';
import logger from '../utils/logger';

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
      RoadmapUser,
      Task,
      Category,
      Milestone,
      Epic,
      UserNotification
    ]
  })
    .then((data) => { con = data; })
    .catch((e) => { logger.error('connection failed', e); });
};

export const close = () => con && con.isConnected
  ? con.close()
  : Promise.resolve();

export const connection = () => con;
