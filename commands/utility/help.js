// ============================================================
//  -help
//  Shows a paginated help panel with buttons to navigate categories
// ============================================================

const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

// ---- All commands organised by category ----
const categories = {
  fun: {
    label: "🎉 Fun & Games",
    color: 0xf4c542,
    commands: [
      { name: "-8ball [question]",            desc: "Ask the magic 8-ball" },
      { name: "-coinflip",                    desc: "Flip a coin" },
      { name: "-roll [2d6]",                  desc: "Roll dice (e.g. 2 six-sided)" },
      { name: "-joke",                        desc: "Get a random joke" },
      { name: "-rps [rock/paper/scissors]",   desc: "Rock Paper Scissors" },
      { name: "-trivia",                      desc: "Timed trivia question" },
      { name: "-guess",                       desc: "Guess a number 1–100" },
      { name: "-slots",                       desc: "Spin the slot machine" },
      { name: "-hangman",                     desc: "Guess the hidden word" },
      { name: "-tictactoe [@user]",           desc: "Tic Tac Toe with someone" },
      { name: "-wordchain",                   desc: "Word must start with last letter" },
      { name: "-nomatterwhat",                desc: 'Build a sentence — no "I" or "Me"!' },
    ],
  },
  utility: {
    label: "🔧 Utility",
    color: 0x5865f2,
    commands: [
      { name: "-ping",              desc: "Check bot response time" },
      { name: "-help",              desc: "Show this help panel" },
      { name: "-userinfo [@user]",  desc: "Show info about a user" },
      { name: "-serverinfo",        desc: "Show server stats" },
      { name: "-avatar [@user]",    desc: "Show a user's profile picture" },
      { name: "-poll Q | A | B",    desc: "Create a reaction poll" },
    ],
  },
  moderation: {
    label: "🔨 Moderation",
    color: 0xed4245,
    commands: [
      { name: "-kick [@user] [reason]",          desc: "Kick a user" },
      { name: "-ban [@user] [reason]",           desc: "Ban a user" },
      { name: "-unban [user ID] [reason]",       desc: "Unban a user by ID" },
      { name: "-mute [@user] [mins] [reason]",   desc: "Timeout a user" },
      { name: "-unmute [@user]",                 desc: "Remove a timeout" },
      { name: "-clear [amount]",                 desc: "Delete messages (up to 100)" },
      { name: "-warn [@user] [reason]",          desc: "Warn a user" },
      { name: "-unwarn [@user] [# or 'all']",    desc: "Remove a warning" },
    ],
  },
};

// ---- Build the overview embed (shown first) ----
function buildOverviewEmbed(user) {
  return new EmbedBuilder()
    .setTitle("🤖 Bot Commands")
    .setDescription(
      "Pick a category below to see its commands.\n\n" +
      "🎉 **Fun & Games** — games and silly commands\n" +
      "🔧 **Utility** — useful server tools\n" +
      "🔨 **Moderation** — manage your server *(requires permissions)*"
    )
    .setColor(0x57f287)
    .setFooter({ text: `Requested by ${user.username}` })
    .setTimestamp();
}

// ---- Build a category embed ----
function buildCategoryEmbed(categoryKey, user) {
  const cat = categories[categoryKey];
  const fields = cat.commands.map((cmd) => ({
    name: `\`${cmd.name}\``,
    value: cmd.desc,
    inline: true,
  }));

  return new EmbedBuilder()
    .setTitle(cat.label)
    .addFields(fields)
    .setColor(cat.color)
    .setFooter({ text: `Requested by ${user.username} • Click 🏠 Home to go back` })
    .setTimestamp();
}

// ---- Build the category navigation buttons ----
function buildCategoryButtons() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("help_fun")
      .setLabel("Fun & Games")
      .setEmoji("🎉")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("help_utility")
      .setLabel("Utility")
      .setEmoji("🔧")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("help_moderation")
      .setLabel("Moderation")
      .setEmoji("🔨")
      .setStyle(ButtonStyle.Danger)
  );
}

// ---- Build the back button ----
function buildBackButton() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("help_overview")
      .setLabel("Home")
      .setEmoji("🏠")
      .setStyle(ButtonStyle.Success)
  );
}

module.exports = {
  name: "help",
  description: "Show the interactive help panel.",
  usage: "-help",

  async execute(message) {
    // Send the overview embed with category buttons
    const panel = await message.reply({
      embeds: [buildOverviewEmbed(message.author)],
      components: [buildCategoryButtons()],
    });

    // Listen for button clicks — only from the person who typed -help
    const collector = panel.createMessageComponentCollector({
      filter: (interaction) => interaction.user.id === message.author.id,
      time: 120000, // buttons stay active for 2 minutes
    });

    collector.on("collect", async (interaction) => {
      // Acknowledge the button press immediately (required by Discord)
      await interaction.deferUpdate();

      if (interaction.customId === "help_overview") {
        panel.edit({
          embeds: [buildOverviewEmbed(message.author)],
          components: [buildCategoryButtons()],
        });
      } else {
        // Extract category key from the button ID (e.g. "help_fun" → "fun")
        const key = interaction.customId.replace("help_", "");
        panel.edit({
          embeds: [buildCategoryEmbed(key, message.author)],
          components: [buildBackButton()],
        });
      }
    });

    // After 2 minutes, disable all buttons so they can't be clicked
    collector.on("end", () => {
      const disabled = buildCategoryButtons();
      disabled.components.forEach((btn) => btn.setDisabled(true));
      panel.edit({ components: [disabled] }).catch(() => {});
    });
  },
};
