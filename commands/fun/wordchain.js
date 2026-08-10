// ============================================================
//  -wordchain
//  Each word must start with the last letter of the previous word.
//  Say a wrong word or repeat one = you're out!
// ============================================================

module.exports = {
  name: "wordchain",
  description: "Each word must start with the last letter of the previous one. Wrong = eliminated!",
  usage: "-wordchain",

  async execute(message) {
    const usedWords = new Set();
    let lastWord = null;
    let lastLetter = null;

    await message.reply(
      `🔗 **Word Chain!**\n\n` +
      `**Rules:**\n` +
      `• Each word must start with the last letter of the previous word\n` +
      `• No repeating words\n` +
      `• One word per message\n` +
      `• Type \`stop\` to end the game\n\n` +
      `Anyone can start — type any word to begin!`
    );

    const filter = (m) => !m.author.bot && /^[a-zA-Z]+$/.test(m.content.trim());
    const collector = message.channel.createMessageCollector({ filter, time: 120000 });

    collector.on("collect", async (m) => {
      const word = m.content.trim().toLowerCase();

      if (word === "stop") {
        collector.stop("stopped");
        return message.channel.send(`🛑 **Word Chain ended!** You made it through **${usedWords.size}** word(s). The chain was ${usedWords.size > 0 ? [...usedWords].join(" → ") : "empty"}.`);
      }

      // First word — anything goes
      if (!lastWord) {
        usedWords.add(word);
        lastWord = word;
        lastLetter = word[word.length - 1];
        return m.reply(`✅ Good start! Next word must start with **${lastLetter.toUpperCase()}**.`);
      }

      // Check it starts with the right letter
      if (word[0] !== lastLetter) {
        return m.reply(`❌ **${m.author.username}** — that word must start with **${lastLetter.toUpperCase()}**! The chain continues.`);
      }

      // Check it hasn't been used
      if (usedWords.has(word)) {
        return m.reply(`❌ **${m.author.username}** — "**${word}**" was already used! The chain continues.`);
      }

      // Valid word!
      usedWords.add(word);
      lastWord = word;
      lastLetter = word[word.length - 1];
      m.reply(`✅ Next word must start with **${lastLetter.toUpperCase()}**. *(${usedWords.size} words so far)*`);
    });

    collector.on("end", (_, reason) => {
      if (reason === "time") {
        message.channel.send(`⏰ **Word Chain timed out!** You got through **${usedWords.size}** word(s).`);
      }
    });
  },
};
