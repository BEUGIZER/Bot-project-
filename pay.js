const { SlashCommandBuilder } = require('discord.js');
const { getAccount, addBalance } = require('../../db/queries/economy');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('pay')
    .setDescription('Pay another user coins')
    .addUserOption((o) => o.setName('user').setDescription('Recipient').setRequired(true))
    .addIntegerOption((o) => o.setName('amount').setDescription('Amount').setRequired(true).setMinValue(1)),
  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');
    if (target.id === interaction.user.id) return interaction.reply({ content: "You can't pay yourself.", ephemeral: true });
    const acc = await getAccount(interaction.guildId, interaction.user.id);
    if (acc.balance < amount) return interaction.reply({ content: 'Insufficient balance.', ephemeral: true });
    await addBalance(interaction.guildId, interaction.user.id, -amount);
    await addBalance(interaction.guildId, target.id, amount);
    await interaction.reply(`💸 Paid **${amount}** coins to **${target.username}**.`);
  },
};
