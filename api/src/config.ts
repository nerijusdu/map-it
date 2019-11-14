export const PORT = process.env.PORT || 8081;

export const JWTAge = 900;

export const ORMConfigs: any[] = [
  {
    env: 'prod',
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'map-it',
    synchronize: true,
    logging: false
  },
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
