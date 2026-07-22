// ============================================================
//  -help
//  Shows a list of all available commands
// ============================================================

module.exports = {
  name: "help",
  description: "Show all available commands.",
  usage: "-help",

  async execute(message) {
    // Delete the command message so nobody else sees it was typed
    message.delete().catch(() => {});

    const helpText = `
**🤖 Bot Commands** *(prefix: \`-\`)*

**🎉 Fun**
\`-8ball [question]\` — Ask the magic 8-ball
\`-coinflip\` — Flip a coin
\`-roll [2d6]\` — Roll dice (e.g. 2 six-sided dice)
\`-joke\` — Get a random joke
\`-rps [rock/paper/scissors]\` — Play Rock Paper Scissors
\`-trivia\` — Answer a trivia question (15 seconds!)
\`-guess\` — Guess a number between 1–100

**🔧 Utility**
\`-ping\` — Check bot response time
\`-help\` — Show this message
\`-userinfo [@user]\` — Show info about a user
\`-serverinfo\` — Show info about this server
\`-avatar [@user]\` — Show a user's profile picture
\`-poll [question] | [option1] | [option2]\` — Start a poll

**🔨 Moderation** *(requires permissions)*
\`-kick [@user] [reason]\` — Kick a user
\`-ban [@user] [reason]\` — Ban a user
\`-unban [user ID] [reason]\` — Unban a user by their ID
\`-mute [@user] [minutes] [reason]\` — Timeout a user
\`-unmute [@user]\` — Remove a timeout
\`-clear [amount]\` — Delete messages (up to 100)
\`-warn [@user] [reason]\` — Warn a user
\`-unwarn [@user] [# or 'all']\` — Remove a warning
`;

    try {
      // Send the help list as a DM to the user
      await message.author.send(helpText);
      // Let them know in the channel (this message will be brief and visible to others)
      const notice = await message.channel.send(`📬 ${message.author}, check your DMs!`);
      // Auto-delete the notice after 5 seconds to keep chat clean
      setTimeout(() => notice.delete().catch(() => {}), 5000);
    } catch {
      // If the user has DMs turned off, just reply normally
      message.channel.send(`${message.author}, ❌ I couldn't DM you! Enable DMs from server members in your Privacy Settings, then try again.`);
    }
  },
};
