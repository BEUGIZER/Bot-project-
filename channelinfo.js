const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('channelinfo')
    .setDescription('Show info about a channel')
    .addChannelOption((o) => o.setName('channel').setDescription('Channel')),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel') || interaction.channel;
    const embed = new EmbedBuilder()
      .setTitle(`#${channel.name}`)
      .addFields(
        { name: 'ID', value: channel.id, inline: true },
        { name: 'Type', value: ChannelType[channel.type] ?? `${channel.type}`, inline: true },
        { name: 'Created', value: `<t:${Math.floor(channel.createdTimestamp / 1000)}:D>`, inline: true }
      );
    await interaction.reply({ embeds: [embed] });
  },
};
