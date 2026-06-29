const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server')
    .addUserOption((o) => o.setName('user').setDescription('User to kick').setRequired(true))
    .addStringOption((o) => o.setName('reason').setDescription('Reason for the kick'))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') ?? 'No reason provided';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'Member not found.', ephemeral: true });
    if (!member.kickable) {
      return interaction.reply({ content: `I can't kick ${user.tag} (role hierarchy or missing permission).`, ephemeral: true });
    }
    await member.kick(reason);
    await interaction.reply(`👋 Kicked **${user.tag}** — ${reason}`);
  },
};
