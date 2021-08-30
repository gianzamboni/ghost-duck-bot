import Discord, { Message, Intents } from 'discord.js';

import { CommandManager } from '@models/command-manager';

const client = new Discord.Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]
});
const commandManager = new CommandManager();

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('message', (message : Message) => {
  commandManager.process(message);
});

client.login(process.env.BOT_TOKEN);