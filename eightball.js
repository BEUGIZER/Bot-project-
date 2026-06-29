const { SlashCommandBuilder } = require('discord.js');
const ANSWERS = ['Yes.', 'No.', 'Definitely!', 'Ask again later.', 'Unlikely.', 'Absolutely.', "I'm not sure.", 'It is certain.', 'Very doubtful.'];
module.exports = {
  data: new SlashCommandBuilder()
    .setName('eightball')
    .setDescription('Ask the magic 8-ball')
    .addStringOption((o) => o.setName('question').setDescription('Your question').setRequired(true)),
  async execute(interaction) {
    const answer = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
    await interaction.reply(`🎱 ${answer}`);
  },
};
