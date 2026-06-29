const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const WORDS = ['discord', 'computer', 'keyboard', 'javascript', 'database', 'internet'];
const pending = new Map();

module.exports = {
  data: new SlashCommandBuilder().setName('wordscramble').setDescription('Unscramble a word'),
  async execute(interaction) {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    const scrambled = word.split('').sort(() => Math.random() - 0.5).join('');
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('wordscramble:reveal').setLabel('Reveal Answer').setStyle(ButtonStyle.Secondary)
    );
    const msg = await interaction.reply({ content: `🔤 Unscramble this word: **${scrambled.toUpperCase()}**`, components: [row], fetchReply: true });
    pending.set(msg.id, word);
  },
  async handleComponent(interaction) {
    const word = pending.get(interaction.message.id);
    await interaction.reply({ content: word ? `The word was **${word}**.` : 'Expired.', ephemeral: true });
  },
};
