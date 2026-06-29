const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('dice')
    .setDescription('Roll dice')
    .addIntegerOption((o) => o.setName('sides').setDescription('Number of sides').setMinValue(2).setMaxValue(1000))
    .addIntegerOption((o) => o.setName('count').setDescription('Number of dice').setMinValue(1).setMaxValue(20)),
  async execute(interaction) {
    const sides = interaction.options.getInteger('sides') ?? 6;
    const count = interaction.options.getInteger('count') ?? 1;
    const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
    await interaction.reply(`🎲 Rolled: ${rolls.join(', ')} (Total: ${rolls.reduce((a, b) => a + b, 0)})`);
  },
};
