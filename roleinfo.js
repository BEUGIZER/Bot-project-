const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('roleinfo')
    .setDescription('Show info about a role')
    .addRoleOption((o) => o.setName('role').setDescription('Role').setRequired(true)),
  async execute(interaction) {
    const role = interaction.options.getRole('role');
    const embed = new EmbedBuilder()
      .setTitle(role.name)
      .setColor(role.color)
      .addFields(
        { name: 'ID', value: role.id, inline: true },
        { name: 'Members', value: `${role.members.size}`, inline: true },
        { name: 'Mentionable', value: role.mentionable ? 'Yes' : 'No', inline: true },
        { name: 'Created', value: `<t:${Math.floor(role.createdTimestamp / 1000)}:D>`, inline: true }
      );
    await interaction.reply({ embeds: [embed] });
  },
};
