import * as Sequelize from 'sequelize';

export const DB = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
        encrypt: true,
        ssl: {
            // TODO: set up your ca correctly to trust the connection
            rejectUnauthorized: false
        }
    }
});
