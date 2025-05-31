require('dotenv').config();
const mysql = require('mysql2/promise');

// Debugging: Log the mysql module to verify import
console.log('mysql2/promise module:', mysql);
console.log('mysql.createPool:', mysql.createPool);

const dbConfig = {
  host: process.env.DB_SERVER || '13.204.63.69',
  user: process.env.DB_USER || 'mnv',
  password: process.env.DB_PASSWORD || 'Manav@21',
  database: process.env.DB_NAME || 'fleet_monkey',
  port: parseInt(process.env.DB_PORT) || 3306,
  connectionLimit: parseInt(process.env.DB_POOL_MAX) || 10,
  queueLimit: parseInt(process.env.DB_POOL_MIN) || 0,
  connectTimeout: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
  waitForConnections: true,
  multipleStatements: true // Enable multiple statements
};

console.log('dbConfig:', dbConfig);

if (!dbConfig.user || !dbConfig.password || !dbConfig.host || !dbConfig.database) {
  throw new Error('Database configuration is missing required credentials');
}

// Verify mysql2/promise is loaded correctly
if (!mysql.createPool || typeof mysql.createPool !== 'function') {
  throw new Error('mysql2/promise module is not loaded correctly. Ensure mysql2 is installed and imported as mysql2/promise.');
}

// Create the pool and test connection
let poolPromise;
try {
  const pool = mysql.createPool(dbConfig);
  console.log('pool:', pool);

  // Wrap the pool in a Promise to maintain expected behavior
  poolPromise = Promise.resolve(pool)
    .then(async pool => {
      console.log('Connected to MySQL');
      try {
        const [rows] = await pool.query('SELECT 1 AS test');
        console.log('MySQL pool test query result:', rows);
        return pool;
      } catch (err) {
        console.error('MySQL pool test query failed:', err);
        throw err;
      }
    })
    .catch(err => {
      console.error('Database connection failed:', err);
      throw err;
    });
} catch (err) {
  console.error('Error creating MySQL pool:', err);
  throw err;
}

module.exports = poolPromise;