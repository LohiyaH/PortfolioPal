const mysql = require('mysql2/promise');
require('dotenv').config();

let pool = null;

const initializeDatabase = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test the connection
    await pool.getConnection();
    console.log('✅ Successfully connected to the database');
    return pool;
  } catch (error) {
    console.error('❌ Failed to connect to the database:', error.message);
    process.exit(1);
  }
};

// Initialize and export the pool
module.exports = (async () => {
  if (!pool) {
    pool = await initializeDatabase();
  }
  return pool;
})();