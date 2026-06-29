const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('reverse')
    .setDescription('Reverse some text')
    .addStringOption((o) => o.setName('text').setDescription('Text to reverse').setRequired(true)),
  async execute(interaction) {
    const text = interaction.options.getString('text');
    await interaction.reply(text.split('').reverse().join(''));
  },
};
