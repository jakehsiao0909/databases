var mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'student',
    password: 'student',
    database: 'chat'
});

connection.connect();

module.exports = {
    connection
};
// Create a database connection and export it from this file.
// You will need to connect with the user "root", no password,
// and to the database "chat".


