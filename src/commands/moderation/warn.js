// ============================================================
//  -warn [@user] [reason]
//  Send a warning to a user (stored in memory while bot is running)
//  Requires: "Moderate Members" permission
//  Example: -warn @User Please stop spamming
// ============================================================

// Import the shared warnings store so -unwarn can access the same data
const { warnings } = require("../../warnings-store");

module.exports = {
  name: "warn",
  description: "Warn a user and log it.",
  usage: "-warn [@user] [reason]",

  async execute(message, args) {
    if (!message.member.permissions.has("ModerateMembers")) {
      return message.reply("❌ You don't have permission to warn members.");
    }

    const target = message.mentions.members.first();
    if (!target) {
      return message.reply("❓ Please mention a user. Example: `-warn @User Reason`");
    }

    if (target.user.bot) {
      return message.reply("❌ You can't warn a bot.");
    }

    if (target.id === message.author.id) {
      return message.reply("❌ You can't warn yourself!");
    }

    const reason = args.slice(1).join(" ");
    if (!reason) {
      return message.reply("❓ Please provide a reason. Example: `-warn @User Spamming`");
    }

    // Add the warning to our store
    if (!warnings.has(target.id)) {
      warnings.set(target.id, []);
    }
    const userWarnings = warnings.get(target.id);
    userWarnings.push({
      reason,
      moderator: message.author.username,
      date: new Date().toDateString(),
    });

    const count = userWarnings.length;

    // Notify the channel
    message.reply(
      `⚠️ **${target.user.username}** has been warned.\n` +
      `📝 Reason: ${reason}\n` +
      `📊 Total warnings: **${count}**`
    );

    // DM the warned user so they know (ignore error if DMs are closed)
    target.send(
      `⚠️ You have been warned in **${message.guild.name}**.\n` +
      `📝 Reason: ${reason}\n` +
      `📊 This is your warning #${count}.`
    ).catch(() => {}); // user may have DMs off — that's okay
  },

};
