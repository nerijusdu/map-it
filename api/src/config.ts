export const PORT = 8081;

export const JWTAge = 900;

export const ORMConfigs: any[] = [
  {
    env: 'development',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'map-it',
    synchronize: true,
    logging: false
  },
  {
    env: 'test',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'map-it-test',
    synchronize: true,
    dropSchema: true,
    logging: false
  }
];
