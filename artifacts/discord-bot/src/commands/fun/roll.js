// ============================================================
//  -roll [dice]
//  Roll dice using standard dice notation like "2d6" (2 six-sided dice)
//  Examples: -roll d20   -roll 2d6   -roll 4d8
// ============================================================

module.exports = {
  name: "roll",
  aliases: ["dice"],
  description: "Roll dice! Use format like `2d6` (2 six-sided dice).",
  usage: "-roll [NdS]  e.g. -roll 2d6",

  async execute(message, args) {
    // Default to a single d6 if nothing is provided
    const input = args[0] || "1d6";

    // Parse the "NdS" format (N = number of dice, S = sides)
    const match = input.toLowerCase().match(/^(\d+)?d(\d+)$/);
    if (!match) {
      return message.reply("❌ Use dice format like `2d6` or `d20`. Example: `-roll 2d6`");
    }

    const count = parseInt(match[1] || "1", 10);  // How many dice
    const sides = parseInt(match[2], 10);          // How many sides each die has

    // Limit to reasonable amounts so the message doesn't get huge
    if (count < 1 || count > 20) return message.reply("❌ Roll between 1 and 20 dice at a time.");
    if (sides < 2 || sides > 1000) return message.reply("❌ Dice must have between 2 and 1000 sides.");

    // Roll each die and collect the results
    const rolls = [];
    for (let i = 0; i < count; i++) {
      rolls.push(Math.floor(Math.random() * sides) + 1);
    }

    const total = rolls.reduce((a, b) => a + b, 0);
    const rollText = rolls.join(", ");

    if (count === 1) {
      message.reply(`🎲 You rolled a **d${sides}** and got: **${total}**`);
    } else {
      message.reply(`🎲 You rolled **${count}d${sides}**\nRolls: [${rollText}]\n**Total: ${total}**`);
    }
  },
};
