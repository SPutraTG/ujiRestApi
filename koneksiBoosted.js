const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dbrestapi',
  connectionLimit: 10
});

// execute query using parameterized statement
async function executeQuery(queryText, values) {
    const [rows] = await pool.query(queryText, values);
    return rows;
  }
  
  module.exports = {
    executeQuery,
    pool
  };