// ============================================================
//  -8ball [question]
//  Ask the magic 8-ball a yes/no question!
//  Example: -8ball Will I win today?
// ============================================================

const responses = [
  // Positive answers
  "✅ It is certain.",
  "✅ It is decidedly so.",
  "✅ Without a doubt.",
  "✅ Yes, definitely!",
  "✅ You may rely on it.",
  "✅ As I see it, yes.",
  "✅ Most likely.",
  "✅ Outlook good.",
  "✅ Yes.",
  "✅ Signs point to yes.",
  // Neutral answers
  "🔮 Reply hazy, try again.",
  "🔮 Ask again later.",
  "🔮 Better not tell you now.",
  "🔮 Cannot predict now.",
  "🔮 Concentrate and ask again.",
  // Negative answers
  "❌ Don't count on it.",
  "❌ My reply is no.",
  "❌ My sources say no.",
  "❌ Outlook not so good.",
  "❌ Very doubtful.",
];

module.exports = {
  name: "8ball",
  aliases: ["eightball"],
  description: "Ask the magic 8-ball a yes/no question.",
  usage: "-8ball [your question]",

  async execute(message, args) {
    // Make sure the user actually asked a question
    if (!args.length) {
      return message.reply("❓ You need to ask a question! Example: `-8ball Will I win today?`");
    }

    const question = args.join(" ");
    // Pick a random response
    const answer = responses[Math.floor(Math.random() * responses.length)];

    message.reply(`🎱 **Q:** ${question}\n**A:** ${answer}`);
  },
};
