const { SlashCommandBuilder } = require('discord.js');
const { getAccount, addBalance, setLastClaim } = require('../../db/queries/economy');
module.exports = {
  data: new SlashCommandBuilder().setName('daily').setDescription('Claim your daily reward'),
  async execute(interaction) {
    const acc = await getAccount(interaction.guildId, interaction.user.id);
    const last = acc.last_daily ? new Date(acc.last_daily) : null;
    if (last && Date.now() - last.getTime() < 24 * 60 * 60 * 1000) {
      const next = new Date(last.getTime() + 24 * 60 * 60 * 1000);
      return interaction.reply({ content: `⏳ Already claimed. Come back <t:${Math.floor(next.getTime() / 1000)}:R>.`, ephemeral: true });
    }
    const reward = 100;
    await addBalance(interaction.guildId, interaction.user.id, reward);
    await setLastClaim(interaction.guildId, interaction.user.id, 'last_daily', new Date());
    await interaction.reply(`✅ You claimed your daily reward of **${reward}** coins!`);
  },
};
