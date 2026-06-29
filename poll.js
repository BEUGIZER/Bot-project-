const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const votes = new Map(); // messageId -> { yes: Set, no: Set }

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Start a yes/no poll')
    .addStringOption((o) => o.setName('question').setDescription('Poll question').setRequired(true)),
  async execute(interaction) {
    const question = interaction.options.getString('question');
    const embed = new EmbedBuilder().setTitle('📊 Poll').setDescription(question).addFields(
      { name: '✅ Yes', value: '0', inline: true },
      { name: '❌ No', value: '0', inline: true }
    );
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('poll:yes').setLabel('Yes').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('poll:no').setLabel('No').setStyle(ButtonStyle.Danger)
    );
    const msg = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });
    votes.set(msg.id, { yes: new Set(), no: new Set() });
  },
  async handleComponent(interaction) {
    const [, choice] = interaction.customId.split(':');
    const tally = votes.get(interaction.message.id);
    if (!tally) return interaction.reply({ content: 'This poll has expired.', ephemeral: true });
    tally.yes.delete(interaction.user.id);
    tally.no.delete(interaction.user.id);
    tally[choice].add(interaction.user.id);
    const embed = EmbedBuilder.from(interaction.message.embeds[0]).setFields(
      { name: '✅ Yes', value: `${tally.yes.size}`, inline: true },
      { name: '❌ No', value: `${tally.no.size}`, inline: true }
    );
    await interaction.update({ embeds: [embed] });
  },
};
