// ============================================================
//  -coinflip
//  Flip a coin — heads or tails!
// ============================================================

module.exports = {
  name: "coinflip",
  aliases: ["flip", "coin"],
  description: "Flip a coin and get heads or tails.",
  usage: "-coinflip",

  async execute(message) {
    const result = Math.random() < 0.5 ? "🪙 **Heads!**" : "🪙 **Tails!**";
    message.reply(result);
  },
};
