// ============================================================
//  -slots
//  Stop each reel one at a time with a button — match symbols to win!
//  Uses only 7 symbols. Costs 20 MB$ to play.
// ============================================================

const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

// Only 7 symbols allowed
const SYMBOLS = ["🍒", "🍋", "🍇", "⭐", "💎", "🎰", "🍀"];
const SPIN_EMOJI = "🔄"; // shown while a reel is still spinning
const COST = 20;         // MB$ cost to play

function randomSymbol() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

// Work out how much the player wins (or loses)
function calcPayout(reels) {
  const [a, b, c] = reels;
  if (a === b && b === c) {
    if (a === "💎") return { label: "💎 **JACKPOT!!** Triple Diamonds!", net: 200 };
    if (a === "🎰") return { label: "🎰 **MEGA WIN!** Triple Slots!", net: 150 };
    return { label: `🎉 **Triple ${a}! Big win!**`, net: 80 };
  }
  if (a === b || b === c || a === c) {
    return { label: "✨ **Two of a kind — small win!**", net: 10 };
  }
  return { label: "😢 **No match. Better luck next time!**", net: -COST };
}

// Build the embed shown during gameplay
function buildEmbed(reels, currentReel, lockedTotal, author) {
  // Display each reel: show its symbol if locked, or the spinning emoji
  const reelDisplay = reels
    .map((r, i) => (i < currentReel ? r : SPIN_EMOJI))
    .join("  |  ");

  return new EmbedBuilder()
    .setTitle(`✨  Reel ${currentReel + 1} / 3`)
    .setDescription(`Stop the reel when you are ready 🎯\n\n${reelDisplay}`)
    .addFields(
      { name: "🔒 Locked Total", value: `${lockedTotal} MB$`, inline: true },
      { name: "💸 Cost",         value: `-${COST} MB$`,       inline: true }
    )
    .setColor(0x5865f2)
    .setFooter({ text: `Playing: ${author.username}` });
}

// Build the Stop button
function stopButton(disabled = false) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("slots_stop")
      .setLabel("Stop")
      .setEmoji("🛑")
      .setStyle(ButtonStyle.Danger)
      .setDisabled(disabled)
  );
}

module.exports = {
  name: "slots",
  description: "Stop each reel one by one — match symbols to win MB$!",
  usage: "-slots",

  async execute(message) {
    const reels = [null, null, null]; // locked symbols, null = still spinning
    let current = 0;                  // which reel is active (0, 1, 2)
    let lockedTotal = 0;              // running MB$ value of locked reels

    // Send the initial embed
    const panel = await message.reply({
      embeds: [buildEmbed(reels, current, lockedTotal, message.author)],
      components: [stopButton()],
    });

    // Only the person who started can click Stop
    const collector = panel.createMessageComponentCollector({
      filter: (i) => i.user.id === message.author.id,
      time: 60000,
    });

    collector.on("collect", async (interaction) => {
      await interaction.deferUpdate();

      // Lock the current reel with a random symbol
      const symbol = randomSymbol();
      reels[current] = symbol;
      current++;

      // All 3 reels locked — show the result
      if (current === 3) {
        collector.stop("done");
        const { label, net } = calcPayout(reels);
        const finalDisplay = reels.join("  |  ");
        const netText = net >= 0 ? `+${net}` : `${net}`;

        const resultEmbed = new EmbedBuilder()
          .setTitle("🎰  Result")
          .setDescription(`${finalDisplay}\n\n${label}`)
          .addFields(
            { name: "🔒 Locked Total", value: `${lockedTotal + (net >= 0 ? net : 0)} MB$`, inline: true },
            { name: "📊 Net",          value: `${netText} MB$`,                              inline: true }
          )
          .setColor(net > 0 ? 0x57f287 : net === -COST ? 0xed4245 : 0xfee75c)
          .setFooter({ text: `Played by ${message.author.username}` });

        return panel.edit({ embeds: [resultEmbed], components: [stopButton(true)] });
      }

      // Update embed for the next reel
      panel.edit({
        embeds: [buildEmbed(reels, current, lockedTotal, message.author)],
        components: [stopButton()],
      });
    });

    // Timed out — auto-lock remaining reels
    collector.on("end", (_, reason) => {
      if (reason !== "done") {
        panel.edit({
          embeds: [
            new EmbedBuilder()
              .setTitle("⏰ Timed out!")
              .setDescription("You took too long — the reels reset.")
              .setColor(0x99aab5),
          ],
          components: [stopButton(true)],
        });
      }
    });
  },
};
