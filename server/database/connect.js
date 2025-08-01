const mysql = require('mysql2/promise');
require('dotenv').config();

console.log('Connecting to the database');

const createConnection = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'password',
            database: process.env.DB_NAME || 'urbanloft',
        });
        console.log('Connected to the database');
        return connection;
    } catch (err) {
        console.error('Database connection failed:', err);
        throw err;
    }
};

module.exports = createConnection();