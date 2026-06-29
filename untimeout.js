const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('untimeout')
    .setDescription("Remove a member's timeout")
    .addUserOption((o) => o.setName('user').setDescription('User').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'Member not found.', ephemeral: true });
    await member.timeout(null);
    await interaction.reply(`✅ Removed timeout for **${user.tag}**.`);
  },
};
