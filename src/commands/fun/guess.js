// ============================================================
//  -guess
//  Guess a number between 1 and 100! You have 5 tries.
// ============================================================

module.exports = {
  name: "guess",
  description: "Guess a number between 1 and 100. You have 5 tries!",
  usage: "-guess",

  async execute(message) {
    const secret = Math.floor(Math.random() * 100) + 1;
    let tries = 0;
    const maxTries = 5;

    await message.reply(
      `🎮 **Number Guessing Game!**\nI'm thinking of a number between **1 and 100**.\n` +
      `You have **${maxTries} tries**. Type your guess in the chat!`
    );

    // Wait for the user who started the game to reply with a number
    const filter = (m) =>
      m.author.id === message.author.id && !isNaN(m.content.trim());

    const collector = message.channel.createMessageCollector({
      filter,
      time: 60000, // 60 seconds to finish the game
    });

    collector.on("collect", async (m) => {
      tries++;
      const guess = parseInt(m.content.trim(), 10);

      if (guess === secret) {
        m.reply(`🎉 **Correct!** The number was **${secret}**! You got it in ${tries} ${tries === 1 ? "try" : "tries"}!`);
        collector.stop("win");
      } else if (tries >= maxTries) {
        m.reply(`😢 **Game over!** The number was **${secret}**. Better luck next time!`);
        collector.stop("lose");
      } else if (guess < secret) {
        m.reply(`📈 Too low! Try higher. *(${maxTries - tries} ${maxTries - tries === 1 ? "try" : "tries"} left)*`);
      } else {
        m.reply(`📉 Too high! Try lower. *(${maxTries - tries} ${maxTries - tries === 1 ? "try" : "tries"} left)*`);
      }
    });

    collector.on("end", (_, reason) => {
      if (reason === "time") {
        message.channel.send(`⏰ **Time's up!** The number was **${secret}**.`);
      }
    });
  },
};
