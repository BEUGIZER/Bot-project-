const pool = require('../pool');

async function addReminder(userId, channelId, remindAt, message) {
  const { rows } = await pool.query(
    'INSERT INTO reminders (user_id, channel_id, remind_at, message) VALUES ($1,$2,$3,$4) RETURNING id',
    [userId, channelId, remindAt, message]
  );
  return rows[0].id;
}

async function getPendingReminders() {
  const { rows } = await pool.query("SELECT * FROM reminders WHERE remind_at <= now() + interval '1 day'");
  return rows;
}

async function deleteReminder(id) {
  await pool.query('DELETE FROM reminders WHERE id=$1', [id]);
}

module.exports = { addReminder, getPendingReminders, deleteReminder };
