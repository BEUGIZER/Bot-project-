const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('base64decode')
    .setDescription('Decode base64 text')
    .addStringOption((o) => o.setName('text').setDescription('Base64 to decode').setRequired(true)),
  async execute(interaction) {
    const text = interaction.options.getString('text');
    try {
      await interaction.reply(`\`${Buffer.from(text, 'base64').toString('utf8')}\``);
    } catch {
      await interaction.reply({ content: '❌ Invalid base64 string.', ephemeral: true });
    }
  },
};
