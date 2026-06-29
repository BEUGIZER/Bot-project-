const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('timestamp')
    .setDescription('Convert a date/time to a Discord timestamp')
    .addStringOption((o) => o.setName('datetime').setDescription('e.g. 2026-07-04 18:00').setRequired(true)),
  async execute(interaction) {
    const input = interaction.options.getString('datetime');
    const date = new Date(input);
    if (isNaN(date.getTime())) return interaction.reply({ content: 'Could not parse that date/time.', ephemeral: true });
    const ts = Math.floor(date.getTime() / 1000);
    await interaction.reply(`<t:${ts}:F> → \`<t:${ts}:F>\``);
  },
};
