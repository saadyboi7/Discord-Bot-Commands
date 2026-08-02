// ============================================================
//  -ping
//  Check if the bot is online and how fast it's responding
// ============================================================

module.exports = {
  name: "ping",
  description: "Check the bot's response time (latency).",
  usage: "-ping",

  async execute(message) {
    // Send a message, then measure how long it took
    const sent = await message.reply("🏓 Pinging...");
    const latency = sent.createdTimestamp - message.createdTimestamp;
    const apiLatency = Math.round(message.client.ws.ping);

    sent.edit(
      `🏓 **Pong!**\n` +
      `📨 Response time: **${latency}ms**\n` +
      `💓 API heartbeat: **${apiLatency}ms**`
    );
  },
};
