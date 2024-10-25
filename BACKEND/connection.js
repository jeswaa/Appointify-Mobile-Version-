const  mysql = require('mysql2');

const database = mysql.createConnection({
    host:'localhost',
    user:'root',
    password: '',
    database:'frontend',
});

module.exports =database;