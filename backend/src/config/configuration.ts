interface AppConfig {
  profile: string;
  server: {
    port: number;
  };
  database: {
    prefix: string;
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
    args: string;
  };
  jwt: {
    secret: string;
    expirationTime: string;
  };
}

const getConfig = (): AppConfig => ({
  profile: process.env.NODE_ENV || 'dev',
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  database: {
    prefix: process.env.DB_PREFIX || 'mongodb',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT, 10) || 27017,
    username: process.env.DB_USERNAME || 'admin',
    password: process.env.DB_PASSWORD || 'admin',
    name: process.env.DB_NAME || 'school_register',
    args: process.env.DB_ARGS || 'ssl=false',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expirationTime: process.env.JWT_EXPIRATION_TIME || '1h',
  },
});

export { AppConfig, getConfig };
