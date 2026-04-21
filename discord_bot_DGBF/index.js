
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

// load commands (recursive)
function loadCommands(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.lstatSync(full).isDirectory()) {
      loadCommands(full);
    } else if (file.endsWith(".js")) {
      const cmd = require(full);
      client.commands.set(cmd.data.name, cmd);
    }
  }
}
loadCommands("./src/commands");

// load events
const eventFiles = fs.readdirSync("./src/events");
for (const file of eventFiles) {
  const event = require(`./src/events/${file}`);
  const name = file.split(".")[0];
  client.on(name, event.bind(null, client));
}

client.login(process.env.TOKEN);
