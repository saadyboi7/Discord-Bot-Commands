// ============================================================
//  -slots
//  Stop each reel one at a time with a button — match symbols to win!
//  Uses only 7 symbols.
// ============================================================

const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const SYMBOLS = ["🍒", "🍋", "🍇", "⭐", "💎", "🎰", "🍀"];
const SPIN_EMOJI = "🔄";

function randomSymbol() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

function calcResult(reels) {
  const [a, b, c] = reels;
  if (a === b && b === c) {
    if (a === "💎") return { label: "💎 **JACKPOT!!** Triple Diamonds!", win: true };
    if (a === "🎰") return { label: "🎰 **MEGA WIN!** Triple Slots!", win: true };
    return { label: `🎉 **Triple ${a}! Big win!**`, win: true };
  }
  if (a === b || b === c || a === c) {
    return { label: "✨ **Two of a kind — nice!**", win: true };
  }
  return { label: "😢 **No match. Better luck next time!**", win: false };
}

function buildEmbed(reels, currentReel, author) {
  const reelDisplay = reels
    .map((r, i) => (i < currentReel ? r : SPIN_EMOJI))
    .join("  |  ");

  return new EmbedBuilder()
    .setTitle(`✨  Reel ${currentReel + 1} / 3`)
    .setDescription(`Stop the reel when you are ready 🎯\n\n${reelDisplay}`)
    .setColor(0x5865f2)
    .setFooter({ text: `Playing: ${author.username}` });
}

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
  description: "Stop each reel one by one and match symbols to win!",
  usage: "-slots",

  async execute(message) {
    const reels = [null, null, null];
    let current = 0;

    const panel = await message.reply({
      embeds: [buildEmbed(reels, current, message.author)],
      components: [stopButton()],
    });

    const collector = panel.createMessageComponentCollector({
      filter: (i) => i.user.id === message.author.id,
      time: 60000,
    });

    collector.on("collect", async (interaction) => {
      await interaction.deferUpdate();

      reels[current] = randomSymbol();
      current++;

      if (current === 3) {
        collector.stop("done");
        const { label, win } = calcResult(reels);
        const finalDisplay = reels.join("  |  ");

        return panel.edit({
          embeds: [
            new EmbedBuilder()
              .setTitle("🎰  Result")
              .setDescription(`${finalDisplay}\n\n${label}`)
              .setColor(win ? 0x57f287 : 0xed4245)
              .setFooter({ text: `Played by ${message.author.username}` }),
          ],
          components: [stopButton(true)],
        });
      }

      panel.edit({
        embeds: [buildEmbed(reels, current, message.author)],
        components: [stopButton()],
      });
    });

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
