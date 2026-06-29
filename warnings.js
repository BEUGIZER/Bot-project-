const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { getWarnings } = require('../../db/queries/moderation');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription("View a member's warnings")
    .addUserOption((o) => o.setName('user').setDescription('User').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const rows = await getWarnings(interaction.guildId, user.id);
    if (!rows.length) return interaction.reply({ content: `${user.tag} has no warnings.`, ephemeral: true });
    const embed = new EmbedBuilder()
      .setTitle(`Warnings for ${user.tag}`)
      .setDescription(rows.map((r, i) => `**${i + 1}.** ${r.reason} — <t:${Math.floor(new Date(r.created_at).getTime() / 1000)}:R>`).join('\n'));
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
