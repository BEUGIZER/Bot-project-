const { SlashCommandBuilder, EmbedBuilder, version: djsVersion } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('botinfo').setDescription('Show info about the bot'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle(interaction.client.user.username)
      .addFields(
        { name: 'Servers', value: `${interaction.client.guilds.cache.size}`, inline: true },
        { name: 'discord.js', value: djsVersion, inline: true },
        { name: 'Uptime', value: `<t:${Math.floor((Date.now() - interaction.client.uptime) / 1000)}:R>`, inline: true }
      );
    await interaction.reply({ embeds: [embed] });
  },
};
