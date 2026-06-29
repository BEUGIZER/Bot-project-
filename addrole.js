const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('addrole')
    .setDescription('Add a role to a member')
    .addUserOption((o) => o.setName('user').setDescription('User').setRequired(true))
    .addRoleOption((o) => o.setName('role').setDescription('Role').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const role = interaction.options.getRole('role');
    const member = await interaction.guild.members.fetch(user.id);
    await member.roles.add(role);
    await interaction.reply(`✅ Added **${role.name}** to **${user.tag}**.`);
  },
};
