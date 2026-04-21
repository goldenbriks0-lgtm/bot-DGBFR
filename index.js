require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.commands = new Collection();
client.db = new PrismaClient();


// ✅ LOAD COMMANDS (FIXED)
function loadCommands(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);

    if (fs.lstatSync(fullPath).isDirectory()) {
      loadCommands(fullPath);
    } else if (file.endsWith(".js")) {
      try {
        const command = require(path.resolve(fullPath)); // 🔥 FIX IMPORTANT
        if (command.data && command.data.name) {
          client.commands.set(command.data.name, command);
        }
      } catch (err) {
        console.error("Erreur chargement commande :", fullPath, err);
      }
    }
  }
}

loadCommands(path.join(__dirname, "src", "commands"));


// ✅ LOAD EVENTS (FIXED)
const eventsPath = path.join(__dirname, "src", "events");
const eventFiles = fs.readdirSync(eventsPath);

for (const file of eventFiles) {
  try {
    const event = require(path.join(eventsPath, file));
    const eventName = file.split(".")[0];

    client.on(eventName, event.bind(null, client));
  } catch (err) {
    console.error("Erreur event :", file, err);
  }
}


// ✅ LOGIN
client.login(process.env.TOKEN);