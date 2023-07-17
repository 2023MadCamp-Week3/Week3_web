const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "0000",
  database: "Week3_DB",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;