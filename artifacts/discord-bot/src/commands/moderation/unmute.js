// ============================================================
//  -unmute [@user]
//  Remove a timeout from a user early
//  Requires: "Moderate Members" permission
//  Example: -unmute @User
// ============================================================

module.exports = {
  name: "unmute",
  aliases: ["untimeout"],
  description: "Remove a timeout from a user.",
  usage: "-unmute [@user]",

  async execute(message) {
    if (!message.member.permissions.has("ModerateMembers")) {
      return message.reply("❌ You don't have permission to unmute members.");
    }

    const target = message.mentions.members.first();
    if (!target) {
      return message.reply("❓ Please mention a user. Example: `-unmute @User`");
    }

    if (!target.isCommunicationDisabled()) {
      return message.reply(`ℹ️ **${target.user.username}** is not currently muted.`);
    }

    await target.timeout(null); // null removes the timeout
    message.reply(`🔊 **${target.user.username}** has been unmuted.`);
  },
};
