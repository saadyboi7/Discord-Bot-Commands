// ============================================================
//  -rps [rock/paper/scissors]
//  Play Rock Paper Scissors against the bot!
//  Example: -rps rock
// ============================================================

const choices = ["rock", "paper", "scissors"];
const emoji = { rock: "🪨", paper: "📄", scissors: "✂️" };

// Returns "win", "lose", or "tie"
function getResult(player, bot) {
  if (player === bot) return "tie";
  if (
    (player === "rock" && bot === "scissors") ||
    (player === "paper" && bot === "rock") ||
    (player === "scissors" && bot === "paper")
  ) {
    return "win";
  }
  return "lose";
}

module.exports = {
  name: "rps",
  description: "Play Rock Paper Scissors against the bot.",
  usage: "-rps [rock / paper / scissors]",

  async execute(message, args) {
    const player = args[0]?.toLowerCase();

    if (!choices.includes(player)) {
      return message.reply("❓ Choose `rock`, `paper`, or `scissors`! Example: `-rps rock`");
    }

    const bot = choices[Math.floor(Math.random() * choices.length)];
    const result = getResult(player, bot);

    const resultText =
      result === "win" ? "🎉 You **win**!" :
      result === "lose" ? "😈 You **lose**!" :
      "🤝 It's a **tie**!";

    message.reply(
      `${emoji[player]} You chose **${player}**\n` +
      `${emoji[bot]} I chose **${bot}**\n\n` +
      resultText
    );
  },
};
