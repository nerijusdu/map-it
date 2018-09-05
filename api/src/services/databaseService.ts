import "reflect-metadata";
import { Connection, createConnection } from 'typeorm';
import { ORMConfig } from "../config";
import { Roadmap, Task, User } from "../models";

let con: Connection;

export const init = () => {
  createConnection({
    ...ORMConfig,
    entities: [
      User,
      Roadmap,
      Task
    ]
  })
    .then((data) => { con = data; })
    .catch((e) => console.log('connection failed', e));
};

export const connection = () => con;