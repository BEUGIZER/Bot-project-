const { SlashCommandBuilder } = require('discord.js');
const { getAccount } = require('../../db/queries/economy');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your balance')
    .addUserOption((o) => o.setName('user').setDescription('User')),
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const acc = await getAccount(interaction.guildId, user.id);
    await interaction.reply(`💰 **${user.username}** — Wallet: ${acc.balance} | Bank: ${acc.bank}`);
  },
};
