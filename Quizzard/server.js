const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: '10.115.2.38',
  user: 'root',
  password: '12345678',
  database: 'Quizzard'
});

connection.connect();

app.get('/', (req, res) => {
  connection.query('SELECT * FROM your_table', (error, results, fields) => {
    if (error) throw error;
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});