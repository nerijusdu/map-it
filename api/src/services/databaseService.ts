import "reflect-metadata";
import { Connection, createConnection } from 'typeorm';
import { ORMConfig } from "../config";
import { User } from "../models";

let con: Connection;

export const init = () => {
  createConnection({
    ...ORMConfig,
    entities: [
      User
    ]
  })
    .then((data) => { con = data; })
    .catch((e) => console.log('connection failed', e));
};

export const connection = () => con;
