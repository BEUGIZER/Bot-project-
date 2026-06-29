const { SlashCommandBuilder } = require('discord.js');
const pool = require('../../db/pool');
const { getAccount } = require('../../db/queries/economy');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('deposit')
    .setDescription('Deposit coins into your bank')
    .addIntegerOption((o) => o.setName('amount').setDescription('Amount').setRequired(true).setMinValue(1)),
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    const acc = await getAccount(interaction.guildId, interaction.user.id);
    if (acc.balance < amount) return interaction.reply({ content: 'Insufficient wallet balance.', ephemeral: true });
    await pool.query('UPDATE economy SET balance = balance - $3, bank = bank + $3 WHERE guild_id=$1 AND user_id=$2', [
      interaction.guildId,
      interaction.user.id,
      amount,
    ]);
    await interaction.reply(`🏦 Deposited **${amount}** coins.`);
  },
};
