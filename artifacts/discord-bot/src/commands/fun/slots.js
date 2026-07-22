// ============================================================
//  -slots
//  Spin the slot machine! Match symbols to win.
// ============================================================

const symbols = ["🍒", "🍋", "🍇", "⭐", "💎", "🎰"];

function spin() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

module.exports = {
  name: "slots",
  description: "Spin the slot machine!",
  usage: "-slots",

  async execute(message) {
    // Build suspense with a "spinning" message first
    const msg = await message.reply("🎰 Spinning...");

    await new Promise((r) => setTimeout(r, 1500));

    const [a, b, c] = [spin(), spin(), spin()];
    const result = `[ ${a} | ${b} | ${c} ]`;

    let outcome;
    if (a === b && b === c) {
      if (a === "💎") {
        outcome = "💎 **JACKPOT!!** Triple diamonds! You're a legend!";
      } else {
        outcome = `🎉 **WINNER!** Triple ${a}! You hit the jackpot!`;
      }
    } else if (a === b || b === c || a === c) {
      outcome = "✨ **Nice!** Two of a kind — so close!";
    } else {
      outcome = "😢 **No match.** Better luck next time!";
    }

    msg.edit(`🎰 **Slots**\n\n${result}\n\n${outcome}`);
  },
};
