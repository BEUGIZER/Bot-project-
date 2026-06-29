const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('emojiinfo')
    .setDescription('Show info about a server emoji')
    .addStringOption((o) => o.setName('emoji').setDescription('The custom emoji').setRequired(true)),
  async execute(interaction) {
    const input = interaction.options.getString('emoji');
    const match = input.match(/<a?:\w+:(\d+)>/);
    if (!match) return interaction.reply({ content: 'Please provide a custom server emoji.', ephemeral: true });
    const emoji = await interaction.guild.emojis.fetch(match[1]).catch(() => null);
    if (!emoji) return interaction.reply({ content: 'Emoji not found in this server.', ephemeral: true });
    const embed = new EmbedBuilder()
      .setTitle(emoji.name)
      .setThumbnail(emoji.url)
      .addFields(
        { name: 'ID', value: emoji.id, inline: true },
        { name: 'Animated', value: emoji.animated ? 'Yes' : 'No', inline: true }
      );
    await interaction.reply({ embeds: [embed] });
  },
};
