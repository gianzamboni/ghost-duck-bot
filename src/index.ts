import Discord, { Message } from 'discord.js';

import { CommandManager } from './models/command-manager'
import { PhasmoDataService } from './services/phasmo-data'

PhasmoDataService.init();

const client = new Discord.Client();
const commandsManager = new CommandManager(".");

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('message', (message : Message) => {
  commandsManager.process(message);
});

client.login(process.env.BOT_TOKEN);