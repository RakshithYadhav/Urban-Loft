import mysql from 'mysql2/promise';

console.log('Connecting to the database');
const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'urbanloft',
});
console.log('Connected to the database');

await connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to the database');
    }
});

const [results, fields] = await connection.execute('SELECT * FROM user');
console.log(results);
console.log(fields);

export default connection;