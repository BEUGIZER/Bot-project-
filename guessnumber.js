const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('guessnumber')
    .setDescription('Guess a number between 1 and 100')
    .addIntegerOption((o) => o.setName('guess').setDescription('Your guess').setRequired(true).setMinValue(1).setMaxValue(100)),
  async execute(interaction) {
    const guess = interaction.options.getInteger('guess');
    const answer = Math.floor(Math.random() * 100) + 1;
    if (guess === answer) return interaction.reply(`🎯 Correct! The number was **${answer}**.`);
    await interaction.reply(`❌ Not quite. The number was **${answer}**. You guessed ${guess}.`);
  },
};
