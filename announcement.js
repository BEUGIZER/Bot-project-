const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('announcement')
    .setDescription('Post a formatted announcement to a channel')
    .addStringOption((o) => o.setName('message').setDescription('Announcement text').setRequired(true))
    .addStringOption((o) => o.setName('title').setDescription('Optional title (defaults to "Announcement")'))
    .addChannelOption((o) => o.setName('channel').setDescription('Channel to post in (defaults to this channel)'))
    .addRoleOption((o) => o.setName('ping_role').setDescription('Optional role to mention'))
    .addBooleanOption((o) => o.setName('ping_everyone').setDescription('Mention @everyone (default: no)'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const message = interaction.options.getString('message');
    const title = interaction.options.getString('title') || '📢 Announcement';
    const channel = interaction.options.getChannel('channel') || interaction.channel;
    const role = interaction.options.getRole('ping_role');
    const pingEveryone = interaction.options.getBoolean('ping_everyone') ?? false;

    if (!channel?.isTextBased?.()) {
      return interaction.reply({ content: '❌ Please pick a text channel.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(message)
      .setColor(0x5865f2)
      .setFooter({ text: `Posted by ${interaction.user.tag}` })
      .setTimestamp();

    const mentionParts = [];
    if (pingEveryone) mentionParts.push('@everyone');
    if (role) mentionParts.push(`<@&${role.id}>`);

    try {
      await channel.send({
        content: mentionParts.length ? mentionParts.join(' ') : undefined,
        embeds: [embed],
        // Explicit allow-list so a ping only fires if the options actually asked for it —
        // prevents an accidental @everyone hiding inside the message text from pinging anyone.
        allowedMentions: {
          parse: pingEveryone ? ['everyone'] : [],
          roles: role ? [role.id] : [],
        },
      });
    } catch (err) {
      return interaction.reply({ content: `❌ I couldn't post there — check my permissions in ${channel}.`, ephemeral: true });
    }

    await interaction.reply({ content: `✅ Announcement posted in ${channel}.`, ephemeral: true });
  },
};
