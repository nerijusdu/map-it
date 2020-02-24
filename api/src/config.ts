// tslint:disable: max-line-length
export const PORT = process.env.PORT || 9091;

export const JWTAge = 900;

export const JWTSecret = process.env.JWT_SECRET || 'deveopmentSecret';

export const logsDir = process.env.LOGS_DIR || './logs';

// default values generated for testing
export const vapidKeys = {
  publicKey: process.env.VAPID_KEYS_PUBLIC || 'BOVb65HC53gtCEUyE-K39AXwiQt_rsyA16jS8OB7xz0D1_56pPJq7DYDWlBMKewTTJGkoe2IJZVy_rFK6GZFSR0',
  privateKey: process.env.VAPID_KEYS_PRIVATE || 'qNLKiXhZKkxwQ63e6inSh5JIV_A9Dagtl-Ymgr3zfAk'
};

export const GoogleActionsClientId = process.env.GOOGLE_ACTIONS_CLIENT_ID || '';

export const webUrl = process.env.WEB_URL || 'http://localhost:9090';

export const googleAuth = {
  client_id: process.env.GOOGLE_CLIENT_ID || '',
  client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
  token_uri: 'https://oauth2.googleapis.com/token',
  userinfo_uri: 'https://www.googleapis.com/oauth2/v2/userinfo?alt=json',
  redirect_uris: [
    (process.env.API_HOST || 'http://localhost:9091') + '/api/account/callback'
  ]
};

export const ORMConfigs: any[] = [
  {
    env: 'prod',
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'map-it',
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
