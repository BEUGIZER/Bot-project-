const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('rate')
    .setDescription('Rate anything out of 10')
    .addStringOption((o) => o.setName('thing').setDescription('What to rate').setRequired(true)),
  async execute(interaction) {
    const thing = interaction.options.getString('thing');
    const score = Math.floor(Math.random() * 11);
    await interaction.reply(`I'd rate "${thing}" a **${score}/10**`);
  },
};
