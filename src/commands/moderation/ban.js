// ============================================================
//  -ban [@user] [reason]
//  Permanently ban a user from the server
//  Requires: "Ban Members" permission
//  Example: -ban @BadUser Spamming
// ============================================================

module.exports = {
  name: "ban",
  description: "Ban a user from the server.",
  usage: "-ban [@user] [reason]",

  async execute(message, args) {
    // Only users with "Ban Members" permission can use this
    if (!message.member.permissions.has("BanMembers")) {
      return message.reply("❌ You don't have permission to ban members.");
    }

    const target = message.mentions.members.first();
    if (!target) {
      return message.reply("❓ Please mention a user to ban. Example: `-ban @User Reason`");
    }

    if (!target.bannable) {
      return message.reply("❌ I can't ban that user — they may have a higher role than me.");
    }

    if (target.id === message.author.id) {
      return message.reply("❌ You can't ban yourself!");
    }

    const reason = args.slice(1).join(" ") || "No reason provided";

    await target.ban({ reason, deleteMessageSeconds: 0 });
    message.reply(`🔨 **${target.user.username}** has been banned.\n📝 Reason: ${reason}`);
  },
};
