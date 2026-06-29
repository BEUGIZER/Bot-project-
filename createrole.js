const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('createrole')
    .setDescription('Create a new role')
    .addStringOption((o) => o.setName('name').setDescription('Role name').setRequired(true))
    .addStringOption((o) => o.setName('color').setDescription('Hex color, e.g. #5865F2'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  async execute(interaction) {
    const name = interaction.options.getString('name');
    const color = interaction.options.getString('color') || undefined;
    const role = await interaction.guild.roles.create({ name, color });
    await interaction.reply(`🎭 Created role **${role.name}**.`);
  },
};
