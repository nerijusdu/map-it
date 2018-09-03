export const PORT = 8081;

export const JWTAge = 3600;

export const ORMConfig: any = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "root",
  database: "map-it",
  synchronize: true,
  logging: false
};
