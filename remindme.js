const { SlashCommandBuilder } = require('discord.js');
const { addReminder, deleteReminder } = require('../../db/queries/reminders');

function parseDuration(input) {
  const match = input.match(/^(\d+)\s*(s|m|h|d)$/i);
  if (!match) return null;
  const n = parseInt(match[1], 10);
  const mult = { s: 1000, m: 60000, h: 3600000, d: 86400000 }[match[2].toLowerCase()];
  return n * mult;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remindme')
    .setDescription('Set a reminder')
    .addStringOption((o) => o.setName('time').setDescription('e.g. 10m, 2h, 1d').setRequired(true))
    .addStringOption((o) => o.setName('message').setDescription('Reminder text').setRequired(true)),
  async execute(interaction) {
    const timeStr = interaction.options.getString('time');
    const ms = parseDuration(timeStr);
    if (!ms) return interaction.reply({ content: 'Invalid time format. Use formats like `10m`, `2h`, `1d`.', ephemeral: true });
    const message = interaction.options.getString('message');
    const remindAt = new Date(Date.now() + ms);
    const id = await addReminder(interaction.user.id, interaction.channelId, remindAt, message);
    if (ms <= 24 * 60 * 60 * 1000) {
      setTimeout(async () => {
        await interaction.channel.send(`⏰ <@${interaction.user.id}>, reminder: ${message}`).catch(() => {});
        await deleteReminder(id).catch(() => {});
      }, ms);
    }
    await interaction.reply({ content: `⏰ I'll remind you in ${timeStr}.`, ephemeral: true });
  },
};
