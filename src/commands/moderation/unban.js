// ============================================================
//  -unban [userID] [reason]
//  Unban a user by their Discord ID (they're not in the server so can't be mentioned)
//  Requires: "Ban Members" permission
//  Example: -unban 123456789012345678 My bad
// ============================================================

module.exports = {
  name: "unban",
  description: "Unban a user by their Discord user ID.",
  usage: "-unban [user ID] [reason]",

  async execute(message, args) {
    if (!message.member.permissions.has("BanMembers")) {
      return message.reply("❌ You don't have permission to unban members.");
    }

    const userId = args[0];
    if (!userId) {
      return message.reply(
        "❓ Please provide the user's ID. Example: `-unban 123456789012345678`\n" +
        "_Tip: Right-click a user → Copy User ID (you need Developer Mode on in Discord settings)_"
      );
    }

    // Check that it looks like a valid Discord ID (17-19 digits)
    if (!/^\d{17,19}$/.test(userId)) {
      return message.reply("❌ That doesn't look like a valid Discord user ID. It should be a long number like `123456789012345678`.");
    }

    const reason = args.slice(1).join(" ") || "No reason provided";

    try {
      // Fetch the ban to confirm the user is actually banned
      const ban = await message.guild.bans.fetch(userId);

      await message.guild.members.unban(userId, reason);
      message.reply(
        `✅ **${ban.user.username}** has been unbanned.\n📝 Reason: ${reason}`
      );
    } catch (error) {
      if (error.code === 10026) {
        // Discord error code for "Unknown Ban"
        message.reply("❌ That user is not currently banned.");
      } else {
        message.reply("❌ Something went wrong. Make sure the ID is correct and I have permission to unban.");
      }
    }
  },
};
