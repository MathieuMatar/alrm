import http from 'http';
import express from 'express';
import cors from 'cors';
import os from 'os';
import dotenv from 'dotenv';
import sequelize from './config/db-sequelize.js';
import router from './pages.js';

dotenv.config();
const server = express();

const syncDB = async () => {
    await sequelize.sync();
    console.log("All tables have been created");
}
(async () => { await syncDB(); })();

// Middleware
server.use(cors());
server.use(express.static('views')); //for resources
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.set('view engine', 'ejs');

server.use('/', router);


// Load port from environment or default to 3000
const PORT = 3005;

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

