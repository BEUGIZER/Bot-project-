const pool = require('../pool');

async function getGuildSettings(guildId) {
  const { rows } = await pool.query('SELECT * FROM guild_settings WHERE guild_id = $1', [guildId]);
  if (rows.length) return rows[0];
  const { rows: inserted } = await pool.query(
    'INSERT INTO guild_settings (guild_id) VALUES ($1) RETURNING *',
    [guildId]
  );
  return inserted[0];
}

async function setActiveCommands(guildId, commandNames) {
  await pool.query(
    `INSERT INTO guild_settings (guild_id, active_commands, updated_at)
     VALUES ($1, $2, now())
     ON CONFLICT (guild_id) DO UPDATE SET active_commands = $2, updated_at = now()`,
    [guildId, commandNames]
  );
}

function isPremiumActive(settings) {
  return !!settings.premium_until && new Date(settings.premium_until) > new Date();
}

module.exports = { getGuildSettings, setActiveCommands, isPremiumActive };
