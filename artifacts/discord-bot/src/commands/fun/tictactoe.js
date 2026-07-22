// ============================================================
//  -tictactoe @user
//  Play Tic Tac Toe against another person!
//  Type a number 1-9 to place your piece on the grid.
// ============================================================

function makeBoard() {
  return ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
}

function drawBoard(board) {
  return (
    "```\n" +
    ` ${board[0]} | ${board[1]} | ${board[2]} \n` +
    "---+---+---\n" +
    ` ${board[3]} | ${board[4]} | ${board[5]} \n` +
    "---+---+---\n" +
    ` ${board[6]} | ${board[7]} | ${board[8]} \n` +
    "```"
  );
}

function checkWinner(board, mark) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // columns
    [0,4,8],[2,4,6],         // diagonals
  ];
  return wins.some((combo) => combo.every((i) => board[i] === mark));
}

function isFull(board) {
  return board.every((cell) => cell === "X" || cell === "O");
}

module.exports = {
  name: "tictactoe",
  aliases: ["ttt"],
  description: "Play Tic Tac Toe against another user.",
  usage: "-tictactoe @user",

  async execute(message) {
    const opponent = message.mentions.members.first();

    if (!opponent) {
      return message.reply("❓ Mention someone to play against! Example: `-tictactoe @Friend`");
    }
    if (opponent.id === message.author.id) {
      return message.reply("❌ You can't play against yourself!");
    }
    if (opponent.user.bot) {
      return message.reply("❌ You can't play against a bot!");
    }

    const players = [
      { user: message.author, member: message.member, mark: "X" },
      { user: opponent.user, member: opponent, mark: "O" },
    ];

    const board = makeBoard();
    let turn = 0; // index into players array

    const msg = await message.reply(
      `❌ **Tic Tac Toe**\n` +
      `**${players[0].user.username}** (X) vs **${players[1].user.username}** (O)\n\n` +
      `${drawBoard(board)}\n` +
      `**${players[0].user.username}'s turn!** Type a number 1–9 to place your X.`
    );

    const filter = (m) =>
      !m.author.bot &&
      (m.author.id === players[0].user.id || m.author.id === players[1].user.id) &&
      /^[1-9]$/.test(m.content.trim());

    const collector = message.channel.createMessageCollector({ filter, time: 120000 });

    collector.on("collect", async (m) => {
      const current = players[turn];

      // Only the current player can move
      if (m.author.id !== current.user.id) return;

      const pos = parseInt(m.content.trim(), 10) - 1;
      m.delete().catch(() => {});

      // Check if that spot is already taken
      if (board[pos] === "X" || board[pos] === "O") {
        const warn = await message.channel.send(`⚠️ That spot is taken! Pick another number.`);
        setTimeout(() => warn.delete().catch(() => {}), 2000);
        return;
      }

      board[pos] = current.mark;

      if (checkWinner(board, current.mark)) {
        collector.stop("win");
        return msg.edit(
          `❌ **Tic Tac Toe**\n\n${drawBoard(board)}\n\n` +
          `🎉 **${current.user.username} wins!** (${current.mark})`
        );
      }

      if (isFull(board)) {
        collector.stop("draw");
        return msg.edit(
          `❌ **Tic Tac Toe**\n\n${drawBoard(board)}\n\n` +
          `🤝 **It's a draw!** Well played both!`
        );
      }

      turn = turn === 0 ? 1 : 0;
      const next = players[turn];

      msg.edit(
        `❌ **Tic Tac Toe**\n` +
        `**${players[0].user.username}** (X) vs **${players[1].user.username}** (O)\n\n` +
        `${drawBoard(board)}\n` +
        `**${next.user.username}'s turn!** Type a number 1–9 to place your ${next.mark}.`
      );
    });

    collector.on("end", (_, reason) => {
      if (reason === "time") {
        msg.edit(`${drawBoard(board)}\n\n⏰ **Game timed out!** Nobody won.`);
      }
    });
  },
};
