const { SlashCommandBuilder } = require('discord.js');

function safeEval(expr) {
  if (!/^[0-9+\-*/().\s%^]+$/.test(expr)) throw new Error('invalid characters');
  const sanitized = expr.replace(/\^/g, '**');
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${sanitized})`)();
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('calculator')
    .setDescription('Evaluate a math expression')
    .addStringOption((o) => o.setName('expression').setDescription('e.g. (4+5)*2').setRequired(true)),
  async execute(interaction) {
    const expr = interaction.options.getString('expression');
    try {
      const result = safeEval(expr);
      await interaction.reply(`🧮 \`${expr}\` = **${result}**`);
    } catch {
      await interaction.reply({ content: '❌ Invalid expression.', ephemeral: true });
    }
  },
};
