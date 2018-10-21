import sequelize from 'sequelize';

const host = process.env.DB_HOST;
const port =
  typeof process.env.DB_PORT === 'string' ? Number(process.env.DB_PORT) : 8080;
const dialect =
  typeof process.env.DB_DIALECT === 'string' ? process.env.DB_DIALECT : 'mysql';

export const DB = new sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host,
    port,
    dialect,
    dialectOptions: {
      encrypt: true,
      ssl: {
        // TODO: set up your ca correctly to trust the connection
        rejectUnauthorized: false
      }
    }
  }
);
