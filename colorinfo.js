const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('colorinfo')
    .setDescription('Show info about a hex color')
    .addStringOption((o) => o.setName('hex').setDescription('e.g. #5865F2').setRequired(true)),
  async execute(interaction) {
    const hex = interaction.options.getString('hex').replace('#', '');
    if (!/^[0-9a-fA-F]{6}$/.test(hex)) return interaction.reply({ content: 'Invalid hex color.', ephemeral: true });
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const embed = new EmbedBuilder().setTitle(`#${hex.toUpperCase()}`).setColor(parseInt(hex, 16)).addFields({ name: 'RGB', value: `${r}, ${g}, ${b}` });
    await interaction.reply({ embeds: [embed] });
  },
};
