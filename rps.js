const { SlashCommandBuilder } = require('discord.js');
const OPTIONS = ['rock', 'paper', 'scissors'];
function decide(p, b) {
  if (p === b) return 'tie';
  if ((p === 'rock' && b === 'scissors') || (p === 'paper' && b === 'rock') || (p === 'scissors' && b === 'paper')) return 'win';
  return 'lose';
}
module.exports = {
  data: new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Play rock-paper-scissors against the bot')
    .addStringOption((o) =>
      o
        .setName('choice')
        .setDescription('Your move')
        .setRequired(true)
        .addChoices({ name: 'Rock', value: 'rock' }, { name: 'Paper', value: 'paper' }, { name: 'Scissors', value: 'scissors' })
    ),
  async execute(interaction) {
    const player = interaction.options.getString('choice');
    const bot = OPTIONS[Math.floor(Math.random() * 3)];
    const result = decide(player, bot);
    const text = result === 'tie' ? "It's a tie!" : result === 'win' ? 'You win! 🎉' : 'I win! 🤖';
    await interaction.reply(`You chose **${player}**, I chose **${bot}**. ${text}`);
  },
};
