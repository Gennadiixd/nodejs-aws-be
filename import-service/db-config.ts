const { PG_PORT, PG_HOST, PG_USERNAME, PG_DATABASE, PG_PASSWORD } = process.env;

export const dbOptions = {
  host: PG_HOST,
  port: parseInt(PG_PORT, 10),
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};