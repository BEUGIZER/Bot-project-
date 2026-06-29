const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('banner')
    .setDescription("Show a user's profile banner")
    .addUserOption((o) => o.setName('user').setDescription('User')),
  async execute(interaction) {
    const target = interaction.options.getUser('user') || interaction.user;
    const user = await interaction.client.users.fetch(target.id, { force: true });
    if (!user.bannerURL()) return interaction.reply({ content: `${user.tag} has no banner set.`, ephemeral: true });
    const embed = new EmbedBuilder().setTitle(`${user.tag}'s banner`).setImage(user.bannerURL({ size: 1024 }));
    await interaction.reply({ embeds: [embed] });
  },
};
