const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('uptime').setDescription('Show how long the bot has been running'),
  async execute(interaction) {
    const seconds = Math.floor(interaction.client.uptime / 1000);
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    await interaction.reply(`🕐 Uptime: ${h}h ${m}m ${s}s`);
  },
};
