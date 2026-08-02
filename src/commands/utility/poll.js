// ============================================================
//  -poll [question] | [option1] | [option2] ...
//  Creates a native Discord poll with radio buttons, vote count,
//  time remaining, and Show Results / Vote buttons.
//  Example: -poll Favorite color? | Red | Blue | Green
// ============================================================

module.exports = {
  name: "poll",
  description: "Create a native Discord poll. Separate question and options with `|`.",
  usage: "-poll Question? | Option 1 | Option 2 | Option 3",

  async execute(message, args) {
    const parts = args.join(" ").split("|").map((p) => p.trim()).filter(Boolean);

    if (parts.length < 3) {
      return message.reply(
        "❓ **Usage:** `-poll Question? | Option 1 | Option 2`\n" +
        "Example: `-poll Favorite color? | Red | Blue | Green`"
      );
    }

    if (parts.length > 11) {
      return message.reply("❌ You can have at most **10 options** in a poll.");
    }

    const question = parts[0];
    const options  = parts.slice(1);

    // Delete the command message to keep chat clean
    message.delete().catch(() => {});

    // Send a native Discord poll — this produces the exact UI from the screenshot:
    // radio buttons, vote count, "23h left", Show Results, and Vote buttons
    await message.channel.send({
      poll: {
        question: { text: question },
        answers: options.map((opt) => ({ poll_media: { text: opt } })),
        duration: 24,            // poll lasts 24 hours
        allow_multiselect: false, // one answer only (radio buttons)
      },
    });
  },
};
