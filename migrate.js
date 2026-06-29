// Applies src/db/schema.sql against DATABASE_URL. Safe to run repeatedly
// (every statement is CREATE TABLE IF NOT EXISTS). Runs automatically before
// "npm start" via the "prestart" script in package.json, so Railway deploys
// always have an up-to-date schema with zero manual steps.
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('../src/db/pool');

async function migrate() {
  const sql = fs.readFileSync(path.join(__dirname, '../src/db/schema.sql'), 'utf8');
  await pool.query(sql);
  console.log('✅ Database schema is up to date.');
  await pool.end();
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
});
