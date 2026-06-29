const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('ascii')
    .setDescription('Turn text into spaced-out banner caps')
    .addStringOption((o) => o.setName('text').setDescription('Text').setRequired(true)),
  async execute(interaction) {
    const text = interaction.options.getString('text').toUpperCase().split('').join(' ');
    await interaction.reply('```\n' + text + '\n```');
  },
};
