const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('ship')
    .setDescription('Calculate compatibility between two users')
    .addUserOption((o) => o.setName('user1').setDescription('First user').setRequired(true))
    .addUserOption((o) => o.setName('user2').setDescription('Second user').setRequired(true)),
  async execute(interaction) {
    const u1 = interaction.options.getUser('user1');
    const u2 = interaction.options.getUser('user2');
    const seed = [...u1.id].reduce((a, c) => a + c.charCodeAt(0), 0) + [...u2.id].reduce((a, c) => a + c.charCodeAt(0), 0);
    const score = seed % 101;
    await interaction.reply(`💘 ${u1.username} + ${u2.username} = **${score}%** compatible`);
  },
};
