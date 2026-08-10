// ============================================================
//  Discord Bot - Main Entry Point
//  This file starts the bot and loads all commands automatically
// ============================================================

const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");

// ----- Create the bot client -----
// "Intents" tell Discord what events our bot wants to listen to
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,           // Basic server info
    GatewayIntentBits.GuildMessages,    // Read messages in servers
    GatewayIntentBits.MessageContent,   // Read the actual message text
    GatewayIntentBits.GuildMembers,     // Access member info (needed for moderation)
    GatewayIntentBits.GuildModeration,  // Access bans, etc.
  ],
});

// ----- The prefix that activates commands -----
const PREFIX = "-";

// ----- Load all commands from the commands folder -----
// client.commands stores every command so we can look them up quickly
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const categories = fs.readdirSync(commandsPath); // ["fun", "utility", "moderation"]

for (const category of categories) {
  const categoryPath = path.join(commandsPath, category);
  const commandFiles = fs.readdirSync(categoryPath).filter((f) => f.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(path.join(categoryPath, file));
    client.commands.set(command.name, command);
    // Also register any aliases (e.g. "-8ball" and "-eightball" both work)
    if (command.aliases) {
      for (const alias of command.aliases) {
        client.commands.set(alias, command);
      }
    }
  }
}

console.log(`✅ Loaded ${client.commands.size} commands`);

// ----- When the bot is ready -----
client.once("clientReady", () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
  console.log(`📋 Prefix: ${PREFIX}`);
  console.log("Systems are online! Bot is loaded!")
  client.user.setActivity(`${PREFIX}help for commands`);
});

// ----- Listen for messages -----
client.on("messageCreate", async (message) => {
  // Ignore messages from other bots or messages without our prefix
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  // Split the message into the command name and any arguments
  // Example: "-roll 2d6" → commandName = "roll", args = ["2d6"]
  const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
  const commandName = args.shift().toLowerCase();

  // Look up the command
  const command = client.commands.get(commandName);
  if (!command) return; // Unknown command — just ignore it

  // Run the command, and catch any errors so the bot doesn't crash
  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(`Error in command "${commandName}":`, error);
    message.reply("❌ Something went wrong running that command. Please try again!");
  }
});

// ----- Log in with the bot token from environment variables -----
const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error("❌ DISCORD_TOKEN is not set! Add it to your secrets.");
  process.exit(1);
}

client.login(token);
