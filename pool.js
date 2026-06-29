const { Pool } = require('pg');

// Railway's managed Postgres (and most hosted Postgres providers) require SSL
// for external/public connections but not for localhost. This auto-detects
// based on the connection string so the same code works locally and on Railway.
const isLocal = /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL || '');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isLocal ? false : { rejectUnauthorized: false },
});

module.exports = pool;
