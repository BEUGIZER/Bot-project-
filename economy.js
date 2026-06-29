const pool = require('../pool');

async function getAccount(guildId, userId) {
  const { rows } = await pool.query('SELECT * FROM economy WHERE guild_id=$1 AND user_id=$2', [guildId, userId]);
  if (rows.length) return rows[0];
  const { rows: inserted } = await pool.query(
    'INSERT INTO economy (guild_id, user_id) VALUES ($1,$2) RETURNING *',
    [guildId, userId]
  );
  return inserted[0];
}

async function addBalance(guildId, userId, amount) {
  await getAccount(guildId, userId);
  await pool.query(
    'UPDATE economy SET balance = balance + $3 WHERE guild_id=$1 AND user_id=$2',
    [guildId, userId, amount]
  );
}

const ALLOWED_COLUMNS = new Set(['last_daily', 'last_weekly', 'last_work']);
async function setLastClaim(guildId, userId, column, date) {
  if (!ALLOWED_COLUMNS.has(column)) throw new Error('Invalid column');
  await pool.query(`UPDATE economy SET ${column} = $3 WHERE guild_id=$1 AND user_id=$2`, [guildId, userId, date]);
}

async function getLeaderboard(guildId, limit = 10) {
  const { rows } = await pool.query(
    'SELECT user_id, balance, bank FROM economy WHERE guild_id=$1 ORDER BY (balance+bank) DESC LIMIT $2',
    [guildId, limit]
  );
  return rows;
}

module.exports = { getAccount, addBalance, setLastClaim, getLeaderboard };
