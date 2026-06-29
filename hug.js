const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getRandomGif } = require('../../utils/gifs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hug')
    .setDescription('Hug someone')
    .addUserOption((o) => o.setName('user').setDescription('Who to hug').setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const text = `🤗 ${interaction.user} hugs ${user}!`;
    const gif = await getRandomGif('anime hug', interaction.user.id);
    if (gif) {
      return interaction.reply({ embeds: [new EmbedBuilder().setDescription(text).setImage(gif)] });
    }
    await interaction.reply(text);
  },
};
