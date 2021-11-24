interface AppConfig {
  server: {
    port: number;
  };
}

const getConfig = (): AppConfig => ({
  server: {
    port: parseInt(process.env.SERVER_PORT, 10) || 3000,
  },
});

export { AppConfig, getConfig };
