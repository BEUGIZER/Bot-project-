const { SlashCommandBuilder } = require('discord.js');
const JOKES = [
  "Why don't scientists trust atoms? Because they make up everything.",
  "I told my computer I needed a break, and now it won't stop sending me vacation ads.",
  'Why do programmers prefer dark mode? Because light attracts bugs.',
  'Why did the scarecrow win an award? Because he was outstanding in his field.',
  'I would tell you a UDP joke, but you might not get it.',
];
module.exports = {
  data: new SlashCommandBuilder().setName('joke').setDescription('Get a random joke'),
  async execute(interaction) {
    await interaction.reply(JOKES[Math.floor(Math.random() * JOKES.length)]);
  },
};
