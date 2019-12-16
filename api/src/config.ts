export const PORT = process.env.PORT || 8081;

export const JWTAge = 900;

export const JWTSecret = process.env.JWT_SECRET || 'deveopmentSecret';

export const ORMConfigs: any[] = [
  {
    env: 'prod',
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
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
    env: 'docker-dev',
    type: 'postgres',
    host: 'map-it-database',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'map-it',
    synchronize: true,
    logging: false
  },
  {
    env: 'test-local',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'map-it-test',
    synchronize: true,
    dropSchema: true,
    logging: false
  },
  {
    env: 'test',
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'map-it-test',
    synchronize: true,
    dropSchema: true,
    logging: false
  }
];
