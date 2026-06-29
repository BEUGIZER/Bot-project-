const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getLeaderboard } = require('../../db/queries/economy');
module.exports = {
  data: new SlashCommandBuilder().setName('leaderboard').setDescription('Show the richest members'),
  async execute(interaction) {
    const rows = await getLeaderboard(interaction.guildId, 10);
    if (!rows.length) return interaction.reply('No economy data yet.');
    const lines = await Promise.all(
      rows.map(async (r, i) => {
        const user = await interaction.client.users.fetch(r.user_id).catch(() => null);
        return `**${i + 1}.** ${user ? user.username : r.user_id} — ${Number(r.balance) + Number(r.bank)} coins`;
      })
    );
    const embed = new EmbedBuilder().setTitle('🏆 Leaderboard').setDescription(lines.join('\n'));
    await interaction.reply({ embeds: [embed] });
  },
};
