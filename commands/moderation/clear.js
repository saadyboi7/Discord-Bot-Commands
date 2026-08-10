// ============================================================
//  -clear [amount]
//  Delete a number of recent messages from the channel (up to 100)
//  Requires: "Manage Messages" permission
//  Example: -clear 10
// ============================================================

module.exports = {
  name: "clear",
  aliases: ["purge", "prune"],
  description: "Delete recent messages from this channel.",
  usage: "-clear [number of messages]",

  async execute(message, args) {
    if (!message.member.permissions.has("ManageMessages")) {
      return message.reply("❌ You don't have permission to delete messages.");
    }

    const amount = parseInt(args[0], 10);

    if (isNaN(amount) || amount < 1 || amount > 100) {
      return message.reply("❓ Please provide a number between 1 and 100. Example: `-clear 10`");
    }

    // Delete the command message + the requested amount
    // (+1 because we also want to delete the command itself)
    const deleted = await message.channel.bulkDelete(amount + 1, true);
    // Note: bulkDelete can only delete messages newer than 14 days

    const actualCount = deleted.size - 1; // don't count the command message
    const confirm = await message.channel.send(
      `🗑️ Deleted **${actualCount}** message${actualCount === 1 ? "" : "s"}.`
    );

    // Auto-delete the confirmation after 3 seconds to keep chat clean
    setTimeout(() => confirm.delete().catch(() => {}), 3000);
  },
};
