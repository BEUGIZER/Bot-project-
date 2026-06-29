const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('mock')
    .setDescription('mOcK soME TexT')
    .addStringOption((o) => o.setName('text').setDescription('Text to mock').setRequired(true)),
  async execute(interaction) {
    const text = interaction.options.getString('text');
    const mocked = text
      .split('')
      .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
      .join('');
    await interaction.reply(mocked);
  },
};
