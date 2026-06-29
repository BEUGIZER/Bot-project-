const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('setnick')
    .setDescription("Change a member's nickname")
    .addUserOption((o) => o.setName('user').setDescription('User').setRequired(true))
    .addStringOption((o) => o.setName('nickname').setDescription('New nickname (leave blank to reset)'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const nickname = interaction.options.getString('nickname');
    const member = await interaction.guild.members.fetch(user.id);
    await member.setNickname(nickname || null);
    await interaction.reply(`✏️ Updated nickname for **${user.tag}**.`);
  },
};
