const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

const QUESTIONS = [
  { q: 'What is the capital of Japan?', options: ['Seoul', 'Tokyo', 'Beijing', 'Bangkok'], answer: 1 },
  { q: 'How many continents are there on Earth?', options: ['5', '6', '7', '8'], answer: 2 },
  { q: 'What is the largest planet in our solar system?', options: ['Earth', 'Saturn', 'Jupiter', 'Neptune'], answer: 2 },
];

const active = new Map();

module.exports = {
  data: new SlashCommandBuilder().setName('trivia').setDescription('Answer a trivia question'),
  async execute(interaction) {
    const q = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    const row = new ActionRowBuilder().addComponents(
      q.options.map((opt, i) => new ButtonBuilder().setCustomId(`trivia:${i}`).setLabel(opt).setStyle(ButtonStyle.Primary))
    );
    const embed = new EmbedBuilder().setTitle('🧠 Trivia').setDescription(q.q);
    const msg = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });
    active.set(msg.id, q);
  },
  async handleComponent(interaction) {
    const q = active.get(interaction.message.id);
    if (!q) return interaction.reply({ content: 'This question has expired.', ephemeral: true });
    const idx = parseInt(interaction.customId.split(':')[1], 10);
    active.delete(interaction.message.id);
    const correct = idx === q.answer;
    await interaction.update({
      embeds: [EmbedBuilder.from(interaction.message.embeds[0]).setFooter({ text: correct ? '✅ Correct!' : `❌ Wrong — answer was ${q.options[q.answer]}` })],
      components: [],
    });
  },
};
