const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user by ID')
    .addStringOption((o) => o.setName('user_id').setDescription('User ID to unban').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const id = interaction.options.getString('user_id');
    try {
      await interaction.guild.members.unban(id);
      await interaction.reply(`✅ Unbanned user \`${id}\`.`);
    } catch {
      await interaction.reply({ content: '❌ Could not unban that user (check the ID).', ephemeral: true });
    }
  },
};
