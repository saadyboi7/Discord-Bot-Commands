// ============================================================
//  -avatar [@user]
//  Shows a user's profile picture (full size)
//  Example: -avatar @JohnDoe
// ============================================================

module.exports = {
  name: "avatar",
  aliases: ["pfp", "icon"],
  description: "Show a user's profile picture.",
  usage: "-avatar [@user]",

  async execute(message) {
    // Use the mentioned user, or the person who typed the command
    const target = message.mentions.users.first() || message.author;
    const avatarUrl = target.displayAvatarURL({ size: 512, extension: "png" });

    message.reply(`🖼️ **${target.username}'s avatar:**\n${avatarUrl}`);
  },
};
