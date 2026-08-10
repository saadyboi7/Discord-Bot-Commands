// ============================================================
//  -hangman
//  Classic hangman — guess the word one letter at a time!
// ============================================================

const words = [
  "discord", "python", "gaming", "keyboard", "monitor", "dragon",
  "wizard", "castle", "rocket", "planet", "guitar", "jungle",
  "penguin", "volcano", "diamond", "thunder", "crystal", "phantom",
  "lantern", "captain", "mystery", "balloon", "chicken", "dolphin",
];

const stages = [
  // 0 wrong
  "```\n  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========```",
  // 1 wrong
  "```\n  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========```",
  // 2 wrong
  "```\n  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========```",
  // 3 wrong
  "```\n  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |\n=========```",
  // 4 wrong
  "```\n  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========```",
  // 5 wrong
  "```\n  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n      |\n=========```",
  // 6 wrong — dead
  "```\n  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n=========```",
];

module.exports = {
  name: "hangman",
  description: "Guess the hidden word letter by letter!",
  usage: "-hangman",

  async execute(message) {
    const word = words[Math.floor(Math.random() * words.length)];
    const guessed = new Set();   // letters already guessed
    const wrong = new Set();     // incorrect guesses
    const maxWrong = 6;

    function buildDisplay() {
      // Show _ for unguessed letters, the letter itself if guessed
      return word.split("").map((l) => (guessed.has(l) ? l : "_")).join(" ");
    }

    function isWon() {
      return word.split("").every((l) => guessed.has(l));
    }

    const msg = await message.reply(
      `${stages[0]}\n\n` +
      `**Word:** \`${buildDisplay()}\`\n` +
      `Wrong guesses (0/${maxWrong}): none\n\n` +
      `_Type a letter to guess! You have ${maxWrong} wrong guesses._`
    );

    // Collect single-letter messages from anyone in the channel
    const filter = (m) => !m.author.bot && /^[a-zA-Z]$/.test(m.content.trim());
    const collector = message.channel.createMessageCollector({ filter, time: 120000 });

    collector.on("collect", async (m) => {
      const letter = m.content.trim().toLowerCase();
      m.delete().catch(() => {}); // clean up guess messages

      if (guessed.has(letter) || wrong.has(letter)) return; // already guessed

      if (word.includes(letter)) {
        guessed.add(letter);
      } else {
        wrong.add(letter);
      }

      const wrongList = wrong.size ? [...wrong].join(", ") : "none";
      const display = buildDisplay();

      if (isWon()) {
        collector.stop("win");
        return msg.edit(
          `${stages[wrong.size]}\n\n` +
          `**Word:** \`${display}\`\n\n` +
          `🎉 **${m.author.username} got it!** The word was **${word}**!`
        );
      }

      if (wrong.size >= maxWrong) {
        collector.stop("lose");
        return msg.edit(
          `${stages[maxWrong]}\n\n` +
          `**Word:** \`${word.split("").join(" ")}\`\n\n` +
          `💀 **Game over!** The word was **${word}**.`
        );
      }

      msg.edit(
        `${stages[wrong.size]}\n\n` +
        `**Word:** \`${display}\`\n` +
        `Wrong guesses (${wrong.size}/${maxWrong}): ${wrongList}\n\n` +
        `_Keep guessing!_`
      );
    });

    collector.on("end", (_, reason) => {
      if (reason === "time") {
        msg.edit(
          `${stages[wrong.size]}\n\n` +
          `⏰ **Time's up!** The word was **${word}**.`
        );
      }
    });
  },
};
