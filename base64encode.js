const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('base64encode')
    .setDescription('Encode text to base64')
    .addStringOption((o) => o.setName('text').setDescription('Text to encode').setRequired(true)),
  async execute(interaction) {
    const text = interaction.options.getString('text');
    await interaction.reply(`\`${Buffer.from(text, 'utf8').toString('base64')}\``);
  },
};
