import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import mysql2 from 'mysql2'; // Ensure mysql2 is used

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql', // ✅ Use mysql instead of mariadb
        dialectModule: mysql2,
        logging: false, // Or set to true or a custom logger
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        }
    }
);

export default sequelize;