const { SlashCommandBuilder } = require('discord.js');
const { getAccount, addBalance, setLastClaim } = require('../../db/queries/economy');
module.exports = {
  data: new SlashCommandBuilder().setName('weekly').setDescription('Claim your weekly reward'),
  async execute(interaction) {
    const acc = await getAccount(interaction.guildId, interaction.user.id);
    const last = acc.last_weekly ? new Date(acc.last_weekly) : null;
    const week = 7 * 24 * 60 * 60 * 1000;
    if (last && Date.now() - last.getTime() < week) {
      const next = new Date(last.getTime() + week);
      return interaction.reply({ content: `⏳ Already claimed. Come back <t:${Math.floor(next.getTime() / 1000)}:R>.`, ephemeral: true });
    }
    const reward = 700;
    await addBalance(interaction.guildId, interaction.user.id, reward);
    await setLastClaim(interaction.guildId, interaction.user.id, 'last_weekly', new Date());
    await interaction.reply(`✅ You claimed your weekly reward of **${reward}** coins!`);
  },
};
