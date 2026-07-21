// ============================================================
//  -kick [@user] [reason]
//  Kick a user from the server (they can rejoin with an invite)
//  Requires: "Kick Members" permission
//  Example: -kick @BadUser Breaking the rules
// ============================================================

module.exports = {
  name: "kick",
  description: "Kick a user from the server.",
  usage: "-kick [@user] [reason]",

  async execute(message, args) {
    // Only users with "Kick Members" permission can use this
    if (!message.member.permissions.has("KickMembers")) {
      return message.reply("❌ You don't have permission to kick members.");
    }

    const target = message.mentions.members.first();
    if (!target) {
      return message.reply("❓ Please mention a user to kick. Example: `-kick @User Reason`");
    }

    // Make sure the bot actually has permission to kick this person
    if (!target.kickable) {
      return message.reply("❌ I can't kick that user — they may have a higher role than me.");
    }

    // Can't kick yourself
    if (target.id === message.author.id) {
      return message.reply("❌ You can't kick yourself!");
    }

    const reason = args.slice(1).join(" ") || "No reason provided";

    await target.kick(reason);
    message.reply(`👢 **${target.user.username}** has been kicked.\n📝 Reason: ${reason}`);
  },
};
