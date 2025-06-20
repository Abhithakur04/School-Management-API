const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port:process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.getConnection((err, connection) => {
    if (err) {
      console.error("❌ Database connection failed:", err.message);
    } else {
      console.log("✅ Successfully connected to MySQL database");
      connection.release();
    }
  });
module.exports = pool.promise();
