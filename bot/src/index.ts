import Discord, { Message } from 'discord.js';

import { Bot } from '@models/bot'
import { PhasmoDataService } from '@services/phasmo-data'

PhasmoDataService.init();

const client = new Discord.Client();
const bot = new Bot();

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('message', (message : Message) => {
  bot.process(message);
});

client.login(process.env.BOT_TOKEN);