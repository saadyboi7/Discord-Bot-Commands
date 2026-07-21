// ============================================================
//  -poll [question] | [option1] | [option2] ...
//  Create a poll with up to 5 options. People react to vote!
//  Example: -poll Favorite color? | Red | Blue | Green
// ============================================================

const NUMBER_EMOJIS = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];

module.exports = {
  name: "poll",
  description: "Create a poll. Separate question and options with `|`.",
  usage: "-poll Question? | Option 1 | Option 2 | Option 3",

  async execute(message, args) {
    // Join all args back and split by the | character
    const parts = args.join(" ").split("|").map((p) => p.trim()).filter(Boolean);

    if (parts.length < 3) {
      return message.reply(
        "❓ **Usage:** `-poll Question? | Option 1 | Option 2`\n" +
        "Example: `-poll Favorite color? | Red | Blue | Green`"
      );
    }

    if (parts.length > 6) {
      return message.reply("❌ You can have at most **5 options** in a poll.");
    }

    const question = parts[0];
    const options = parts.slice(1); // Everything after the first | is an option

    // Build the poll text
    const optionLines = options
      .map((opt, i) => `${NUMBER_EMOJIS[i]} ${opt}`)
      .join("\n");

    const pollMessage = await message.channel.send(
      `📊 **Poll by ${message.author.username}**\n\n` +
      `**${question}**\n\n` +
      `${optionLines}`
    );

    // Delete the command message to keep chat clean
    message.delete().catch(() => {}); // ignore error if we can't delete

    // Add reaction buttons so people can vote
    for (let i = 0; i < options.length; i++) {
      await pollMessage.react(NUMBER_EMOJIS[i]);
    }
  },
};
