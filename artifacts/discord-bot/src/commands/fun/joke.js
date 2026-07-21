// ============================================================
//  -joke
//  Get a random joke from the internet (safe for all ages)
// ============================================================

module.exports = {
  name: "joke",
  description: "Get a random joke.",
  usage: "-joke",

  async execute(message) {
    try {
      // Fetch a safe, family-friendly joke from a free API (no key needed)
      const res = await fetch(
        "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,explicit,racist,sexist"
      );
      const data = await res.json();

      if (data.type === "single") {
        // One-liner joke
        message.reply(`😂 ${data.joke}`);
      } else {
        // Setup + punchline joke (send setup first, then punchline after delay)
        await message.reply(`😏 ${data.setup}`);
        setTimeout(() => {
          message.channel.send(`😂 ${data.delivery}`);
        }, 2000); // wait 2 seconds for the punchline
      }
    } catch (error) {
      message.reply("😅 Couldn't fetch a joke right now. Try again later!");
    }
  },
};
