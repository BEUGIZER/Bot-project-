const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const games = new Map();

function render(board) {
  const rows = [];
  for (let r = 0; r < 3; r++) {
    const row = new ActionRowBuilder();
    for (let c = 0; c < 3; c++) {
      const i = r * 3 + c;
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`tictactoe:${i}`)
          .setLabel(board[i] || ' ')
          .setStyle(board[i] === 'X' ? ButtonStyle.Primary : board[i] === 'O' ? ButtonStyle.Danger : ButtonStyle.Secondary)
          .setDisabled(!!board[i])
      );
    }
    rows.push(row);
  }
  return rows;
}

function checkWin(board, mark) {
  const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  return lines.some((line) => line.every((i) => board[i] === mark));
}

module.exports = {
  data: new SlashCommandBuilder().setName('tictactoe').setDescription('Play tic-tac-toe against the bot'),
  async execute(interaction) {
    const board = Array(9).fill(null);
    const msg = await interaction.reply({ content: "You're X, I'm O. Your move!", components: render(board), fetchReply: true });
    games.set(msg.id, board);
  },
  async handleComponent(interaction) {
    const board = games.get(interaction.message.id);
    if (!board) return interaction.reply({ content: 'This game has expired.', ephemeral: true });
    const i = parseInt(interaction.customId.split(':')[1], 10);
    if (board[i]) return interaction.deferUpdate();
    board[i] = 'X';
    if (checkWin(board, 'X')) {
      games.delete(interaction.message.id);
      return interaction.update({ content: '🎉 You win!', components: render(board) });
    }
    const empty = board.map((v, idx) => (v ? null : idx)).filter((v) => v !== null);
    if (!empty.length) {
      games.delete(interaction.message.id);
      return interaction.update({ content: "🤝 It's a draw!", components: render(board) });
    }
    const move = empty[Math.floor(Math.random() * empty.length)];
    board[move] = 'O';
    if (checkWin(board, 'O')) {
      games.delete(interaction.message.id);
      return interaction.update({ content: '🤖 I win!', components: render(board) });
    }
    const stillEmpty = board.some((v) => !v);
    await interaction.update({ content: stillEmpty ? 'Your move!' : "🤝 It's a draw!", components: render(board) });
  },
};
