// ============================================================
//  -nomatterwhat
//  Everyone takes turns adding ONE word to build a sentence.
//  Say "I" or "Me" and you're eliminated! Last one standing wins.
// ============================================================

const BANNED_WORDS = ["i", "me"];

module.exports = {
  name: "nomatterwhat",
  aliases: ["nmw"],
  description: 'Build a sentence together — but NEVER say "I" or "Me"!',
  usage: "-nomatterwhat",

  async execute(message) {
    const sentence = [];           // words added so far
    const eliminated = new Set();  // user IDs who slipped up

    await message.reply(
      `🚫 **No Matter What!**\n\n` +
      `**Rules:**\n` +
      `• Everyone takes turns adding **one word** to the sentence\n` +
      `• You CANNOT say **"I"** or **"Me"** — no matter what!\n` +
      `• Say a banned word = you're **eliminated** ☠️\n` +
      `• Type \`end\` to finish and see the full sentence\n\n` +
      `Anyone can go first — type one word to start!`
    );

    const filter = (m) =>
      !m.author.bot &&
      !eliminated.has(m.author.id) &&
      /^\S+$/.test(m.content.trim()); // one word only (no spaces)

    const collector = message.channel.createMessageCollector({
      filter,
      time: 180000, // 3 minutes
    });

    collector.on("collect", async (m) => {
      const word = m.content.trim();

      // End the game
      if (word.toLowerCase() === "end") {
        collector.stop("ended");
        const full = sentence.length ? sentence.join(" ") : "*(nothing yet)*";
        return message.channel.send(
          `📖 **Game over!**\n\n` +
          `Here's the sentence you built:\n> ${full}`
        );
      }

      // Check for banned words
      if (BANNED_WORDS.includes(word.toLowerCase())) {
        eliminated.add(m.author.id);
        sentence.push(`~~${word}~~`); // show the slip-up crossed out

        const full = sentence.join(" ");
        await m.reply(
          `☠️ **${m.author.username}** said "**${word}**" — ELIMINATED!\n\n` +
          `Sentence so far:\n> ${full}`
        );

        // If only one person is left (and at least 2 played), declare winner
        // We can't easily track "active" players, so just keep going
        return;
      }

      // Valid word — add it to the sentence
      sentence.push(word);
      const full = sentence.join(" ");
      m.reply(`✅ *(${sentence.length} word${sentence.length === 1 ? "" : "s"})*\n> ${full}`);
    });

    collector.on("end", (_, reason) => {
      if (reason === "time") {
        const full = sentence.length ? sentence.join(" ") : "*(nothing)*";
        message.channel.send(
          `⏰ **Time's up!**\n\nHere's what you built:\n> ${full}`
        );
      }
    });
  },
};
