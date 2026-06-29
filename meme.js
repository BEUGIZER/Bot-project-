const { SlashCommandBuilder } = require('discord.js');
const MEMES = [
  'Nobody: ... Discord bot at 3am: time to send a notification.',
  'Me: I will go to bed early. Also me at 2am: rewriting the entire codebase.',
  'When the code finally works and you have no idea why.',
  "POV: you're explaining to your server why /customize only lets you pick 5 commands.",
];
module.exports = {
  data: new SlashCommandBuilder().setName('meme').setDescription('Get a random text meme'),
  async execute(interaction) {
    await interaction.reply(`😂 ${MEMES[Math.floor(Math.random() * MEMES.length)]}`);
  },
};
