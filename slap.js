const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getRandomGif } = require('../../utils/gifs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slap')
    .setDescription('Slap someone (playfully)')
    .addUserOption((o) => o.setName('user').setDescription('Who to slap').setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const text = `👋 ${interaction.user} slaps ${user}!`;
    const gif = await getRandomGif('anime slap', interaction.user.id);
    if (gif) {
      return interaction.reply({ embeds: [new EmbedBuilder().setDescription(text).setImage(gif)] });
    }
    await interaction.reply(text);
  },
};
