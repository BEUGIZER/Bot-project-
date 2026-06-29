const pool = require('../pool');

async function addWarning(guildId, userId, moderatorId, reason) {
  await pool.query(
    'INSERT INTO warnings (guild_id, user_id, moderator_id, reason) VALUES ($1,$2,$3,$4)',
    [guildId, userId, moderatorId, reason]
  );
}

async function getWarnings(guildId, userId) {
  const { rows } = await pool.query(
    'SELECT * FROM warnings WHERE guild_id=$1 AND user_id=$2 ORDER BY created_at DESC',
    [guildId, userId]
  );
  return rows;
}

async function clearWarnings(guildId, userId) {
  await pool.query('DELETE FROM warnings WHERE guild_id=$1 AND user_id=$2', [guildId, userId]);
}

module.exports = { addWarning, getWarnings, clearWarnings };
