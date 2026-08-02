// ============================================================
//  -unwarn [@user] [warning number]
//  Remove a specific warning from a user, or all of them
//  Requires: "Moderate Members" permission
//  Examples:
//    -unwarn @User 2       ← removes warning #2
//    -unwarn @User all     ← clears all warnings
// ============================================================

const { warnings } = require("../../warnings-store");

module.exports = {
  name: "unwarn",
  description: "Remove a warning from a user.",
  usage: "-unwarn [@user] [warning number or 'all']",

  async execute(message, args) {
    if (!message.member.permissions.has("ModerateMembers")) {
      return message.reply("❌ You don't have permission to remove warnings.");
    }

    const target = message.mentions.members.first();
    if (!target) {
      return message.reply("❓ Please mention a user. Example: `-unwarn @User 1`");
    }

    const userWarnings = warnings.get(target.id);

    if (!userWarnings || userWarnings.length === 0) {
      return message.reply(`ℹ️ **${target.user.username}** has no warnings.`);
    }

    const input = args[1]?.toLowerCase();

    // -unwarn @User all — clear every warning
    if (input === "all") {
      warnings.delete(target.id);
      return message.reply(`✅ Cleared all **${userWarnings.length}** warning(s) from **${target.user.username}**.`);
    }

    // -unwarn @User 2 — remove a specific warning by number
    const num = parseInt(input, 10);
    if (isNaN(num) || num < 1 || num > userWarnings.length) {
      return message.reply(
        `❓ Please give a valid warning number (1–${userWarnings.length}) or \`all\`.\n` +
        `Example: \`-unwarn @User 1\` or \`-unwarn @User all\``
      );
    }

    const removed = userWarnings.splice(num - 1, 1)[0]; // remove that one warning
    message.reply(
      `✅ Removed warning #${num} from **${target.user.username}**.\n` +
      `📝 That warning was: "${removed.reason}"\n` +
      `📊 They now have **${userWarnings.length}** warning(s) remaining.`
    );
  },
};
