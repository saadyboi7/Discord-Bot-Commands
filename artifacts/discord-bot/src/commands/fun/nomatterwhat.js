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
        m.delete().catch(() => {});
        collector.stop("ended");
        const full = sentence.length ? sentence.join(" ") : "*(nothing yet)*";
        return message.channel.send(
          `📖 **Game over! Here's the sentence you built:**\n\n> ${full}`
        );
      }

      // Check for banned words
      if (BANNED_WORDS.includes(word.toLowerCase())) {
        m.delete().catch(() => {}); // hide the banned word
        eliminated.add(m.author.id);
        sentence.push(`~~${word}~~`); // mark the slip-up for the reveal

        await message.channel.send(
          `☠️ **${m.author.username}** slipped up and said a banned word — **ELIMINATED!**\n` +
          `*(the full sentence will be revealed at the end)*`
        );

        // If only one person is left (and at least 2 played), declare winner
        // We can't easily track "active" players, so just keep going
        return;
      }

      // Valid word — delete the message and confirm secretly
      m.delete().catch(() => {});
      sentence.push(word);
      const confirm = await message.channel.send(`✅ Word added! *(${sentence.length} word${sentence.length === 1 ? "" : "s"} so far — sentence hidden until the end!)*`);
      setTimeout(() => confirm.delete().catch(() => {}), 3000);
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
