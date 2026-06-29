const { SlashCommandBuilder } = require('discord.js');
const { getAccount, addBalance, setLastClaim } = require('../../db/queries/economy');
module.exports = {
  data: new SlashCommandBuilder().setName('work').setDescription('Work to earn coins'),
  async execute(interaction) {
    const acc = await getAccount(interaction.guildId, interaction.user.id);
    const last = acc.last_work ? new Date(acc.last_work) : null;
    if (last && Date.now() - last.getTime() < 60 * 60 * 1000) {
      const next = new Date(last.getTime() + 60 * 60 * 1000);
      return interaction.reply({ content: `⏳ Tired. Rest until <t:${Math.floor(next.getTime() / 1000)}:R>.`, ephemeral: true });
    }
    const reward = Math.floor(Math.random() * 41) + 10;
    await addBalance(interaction.guildId, interaction.user.id, reward);
    await setLastClaim(interaction.guildId, interaction.user.id, 'last_work', new Date());
    await interaction.reply(`💼 You worked and earned **${reward}** coins!`);
  },
};
