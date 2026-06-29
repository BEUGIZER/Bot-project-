const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('choose')
    .setDescription('Let the bot choose between options')
    .addStringOption((o) => o.setName('options').setDescription('Comma-separated options').setRequired(true)),
  async execute(interaction) {
    const options = interaction.options
      .getString('options')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (options.length < 2) return interaction.reply({ content: 'Give me at least 2 options, comma-separated.', ephemeral: true });
    const choice = options[Math.floor(Math.random() * options.length)];
    await interaction.reply(`🤔 I choose: **${choice}**`);
  },
};
