const { SlashCommandBuilder } = require('discord.js');
const { getAccount, addBalance } = require('../../db/queries/economy');
const SYMBOLS = ['🍒', '🍋', '🔔', '⭐', '💎'];
module.exports = {
  data: new SlashCommandBuilder()
    .setName('slotmachine')
    .setDescription('Spin the slot machine')
    .addIntegerOption((o) => o.setName('bet').setDescription('Coins to bet').setRequired(true).setMinValue(1)),
  async execute(interaction) {
    const bet = interaction.options.getInteger('bet');
    const acc = await getAccount(interaction.guildId, interaction.user.id);
    if (acc.balance < bet) return interaction.reply({ content: 'Insufficient balance.', ephemeral: true });
    const spin = Array.from({ length: 3 }, () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
    const win = spin[0] === spin[1] && spin[1] === spin[2];
    const payout = win ? bet * 5 : -bet;
    await addBalance(interaction.guildId, interaction.user.id, payout);
    await interaction.reply(`🎰 ${spin.join(' | ')}\n${win ? `🎉 Jackpot! You won **${bet * 5}**!` : `😢 You lost **${bet}**.`}`);
  },
};
