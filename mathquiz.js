const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('mathquiz').setDescription('Solve a quick math problem'),
  async execute(interaction) {
    const a = Math.floor(Math.random() * 50) + 1;
    const b = Math.floor(Math.random() * 50) + 1;
    const op = ['+', '-', '*'][Math.floor(Math.random() * 3)];
    const result = op === '+' ? a + b : op === '-' ? a - b : a * b;
    await interaction.reply(`🧮 What is **${a} ${op} ${b}**? (Answer: ||${result}||)`);
  },
};
