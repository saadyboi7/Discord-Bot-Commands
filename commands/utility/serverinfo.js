// ============================================================
//  -serverinfo
//  Shows information about the current Discord server
// ============================================================

module.exports = {
  name: "serverinfo",
  aliases: ["si", "server"],
  description: "Show info about this server.",
  usage: "-serverinfo",

  async execute(message) {
    const guild = message.guild;

    // Count how many members are bots vs humans
    const totalMembers = guild.memberCount;
    const bots = guild.members.cache.filter((m) => m.user.bot).size;
    const humans = totalMembers - bots;

    const created = guild.createdAt.toDateString();
    const owner = await guild.fetchOwner();

    message.reply(
      `🏠 **Server Info — ${guild.name}**\n\n` +
      `🆔 **Server ID:** ${guild.id}\n` +
      `👑 **Owner:** ${owner.user.username}\n` +
      `📅 **Created:** ${created}\n` +
      `👥 **Members:** ${humans} humans, ${bots} bots (${totalMembers} total)\n` +
      `💬 **Channels:** ${guild.channels.cache.size}\n` +
      `🎭 **Roles:** ${guild.roles.cache.size}\n` +
      `😀 **Emojis:** ${guild.emojis.cache.size}\n` +
      `🔒 **Verification level:** ${guild.verificationLevel}`
    );
  },
};
