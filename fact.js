const { SlashCommandBuilder } = require('discord.js');
const FACTS = [
  'Honey never spoils if stored properly.',
  'Octopuses have three hearts.',
  'A bolt of lightning is hotter than the surface of the sun.',
  'Bananas are botanically classified as berries.',
  'The Eiffel Tower can grow more than 6 inches taller in summer due to heat expansion.',
];
module.exports = {
  data: new SlashCommandBuilder().setName('fact').setDescription('Get a random fact'),
  async execute(interaction) {
    await interaction.reply(`📚 ${FACTS[Math.floor(Math.random() * FACTS.length)]}`);
  },
};
