const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('serverboosts').setDescription('Show server boost status'),
  async execute(interaction) {
    const g = interaction.guild;
    await interaction.reply(`💎 Boost level **${g.premiumTier}** with **${g.premiumSubscriptionCount ?? 0}** boosts.`);
  },
};
