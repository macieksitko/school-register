interface AppConfig {
  server: {
    port: number;
  };
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
  };
  jwt: {
    secret: string;
    expirationTime: string;
  };
}

const getConfig = (): AppConfig => ({
  server: {
    port: parseInt(process.env.SERVER_PORT, 10) || 3000,
  },
  database: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT, 10) || 27017,
    username: process.env.DB_USERNAME || 'admin',
    password: process.env.DB_PASSWORD || 'admin',
    name: process.env.DB_NAME || 'school_register',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expirationTime: process.env.JWT_EXPIRATION_TIME || '1h',
  },
});

export { AppConfig, getConfig };
