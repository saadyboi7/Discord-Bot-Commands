// ============================================================
//  -mute [@user] [minutes] [reason]
//  Timeout (mute) a user for a set number of minutes
//  Requires: "Moderate Members" permission
//  Example: -mute @BadUser 10 Spamming
// ============================================================

module.exports = {
  name: "mute",
  aliases: ["timeout"],
  description: "Timeout (mute) a user for X minutes.",
  usage: "-mute [@user] [minutes] [reason]",

  async execute(message, args) {
    if (!message.member.permissions.has("ModerateMembers")) {
      return message.reply("❌ You don't have permission to mute members.");
    }

    const target = message.mentions.members.first();
    if (!target) {
      return message.reply("❓ Please mention a user. Example: `-mute @User 10 Spamming`");
    }

    if (!target.moderatable) {
      return message.reply("❌ I can't mute that user — they may have a higher role than me.");
    }

    if (target.id === message.author.id) {
      return message.reply("❌ You can't mute yourself!");
    }

    // Second argument is the number of minutes (default: 5)
    const minutes = parseInt(args[1], 10);
    if (isNaN(minutes) || minutes < 1 || minutes > 40320) {
      return message.reply("❓ Please provide the number of minutes (1 – 40320). Example: `-mute @User 10`");
    }

    const reason = args.slice(2).join(" ") || "No reason provided";
    const durationMs = minutes * 60 * 1000; // convert minutes to milliseconds

    await target.timeout(durationMs, reason);
    message.reply(
      `🔇 **${target.user.username}** has been muted for **${minutes} minute${minutes === 1 ? "" : "s"}**.\n` +
      `📝 Reason: ${reason}`
    );
  },
};
