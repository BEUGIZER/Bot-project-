const pool = require('../pool');
const crypto = require('crypto');

async function createLicenseKey(durationDays, note = null) {
  const code = crypto.randomBytes(8).toString('hex').toUpperCase().match(/.{1,4}/g).join('-');
  await pool.query(
    'INSERT INTO license_keys (code, duration_days, note) VALUES ($1, $2, $3)',
    [code, durationDays, note]
  );
  return code;
}

async function redeemLicenseKey(code, guildId) {
  const { rows } = await pool.query('SELECT * FROM license_keys WHERE code = $1', [code]);
  if (!rows.length) return { ok: false, reason: 'not_found' };
  const key = rows[0];
  if (key.redeemed_at) return { ok: false, reason: 'already_used' };

  await pool.query(
    'UPDATE license_keys SET redeemed_at = now(), redeemed_by_guild = $1 WHERE code = $2',
    [guildId, code]
  );

  const { rows: gRows } = await pool.query(
    'SELECT premium_until FROM guild_settings WHERE guild_id = $1',
    [guildId]
  );
  const current = gRows[0]?.premium_until ? new Date(gRows[0].premium_until) : null;
  const base = current && current > new Date() ? current : new Date();
  const newExpiry = new Date(base.getTime() + key.duration_days * 24 * 60 * 60 * 1000);

  await pool.query(
    `INSERT INTO guild_settings (guild_id, premium_until, updated_at)
     VALUES ($1, $2, now())
     ON CONFLICT (guild_id) DO UPDATE SET premium_until = $2, updated_at = now()`,
    [guildId, newExpiry]
  );

  return { ok: true, expiry: newExpiry, days: key.duration_days };
}

module.exports = { createLicenseKey, redeemLicenseKey };
    
