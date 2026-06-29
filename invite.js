const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('invite').setDescription('Get an invite link for this bot'),
  async execute(interaction) {
    const link = `https://discord.com/oauth2/authorize?client_id=${interaction.client.user.id}&scope=bot%20applications.commands&permissions=8`;
    await interaction.reply({ content: `🔗 [Invite me to another server](${link})`, ephemeral: true });
  },
};
