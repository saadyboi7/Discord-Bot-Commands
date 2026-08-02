// ============================================================
//  -userinfo [@user]
//  Shows info about a user (or yourself if no one is mentioned)
//  Example: -userinfo @JohnDoe
// ============================================================

module.exports = {
  name: "userinfo",
  aliases: ["ui", "whois"],
  description: "Show info about a user.",
  usage: "-userinfo [@user]",

  async execute(message, args) {
    // If someone is mentioned use them, otherwise show the person who typed the command
    const target = message.mentions.members.first() || message.member;
    const user = target.user;

    // Format dates in a readable way
    const joined = target.joinedAt?.toDateString() || "Unknown";
    const created = user.createdAt.toDateString();

    // List their roles (skip @everyone which every user has)
    const roles = target.roles.cache
      .filter((r) => r.name !== "@everyone")
      .map((r) => r.name)
      .join(", ") || "None";

    message.reply(
      `👤 **User Info — ${user.username}**\n\n` +
      `🪪 **Username:** ${user.username}\n` +
      `🔖 **Nickname:** ${target.nickname || "None"}\n` +
      `🆔 **User ID:** ${user.id}\n` +
      `🤖 **Bot?** ${user.bot ? "Yes" : "No"}\n` +
      `📅 **Account created:** ${created}\n` +
      `📥 **Joined server:** ${joined}\n` +
      `🏷️ **Roles:** ${roles}`
    );
  },
};
