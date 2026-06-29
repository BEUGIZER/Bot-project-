const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { clearWarnings } = require('../../db/queries/moderation');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearwarns')
    .setDescription("Clear a member's warnings")
    .addUserOption((o) => o.setName('user').setDescription('User').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    await clearWarnings(interaction.guildId, user.id);
    await interaction.reply(`🧹 Cleared warnings for **${user.tag}**.`);
  },
};
