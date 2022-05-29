import Discord, { Message, Intents } from 'discord.js';

import { GhostDuckBot } from './ghost-duck-bot';
import { BotLogger } from '@helpers/bot-logger';

if(!process.env.BOT_TOKEN) throw "Discord Bot token needed";

BotLogger.init();

const bot = new GhostDuckBot();

const client = new Discord.Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]
});

client.on('ready', () => {
  BotLogger.log.info(`Running in ${process.env.NODE_ENV} mode`);
  BotLogger.log.info(`Logged in as ${client.user?.tag} in ${client.guilds.cache.size} guilds:`);
  for(let [ _ , guild ] of client.guilds.cache) {
    BotLogger.log.info(`\t* ${guild.name}`);
  }
});

client.on('messageCreate', (message : Message) => {
  bot.process(message);
});

client.on('error', (error: Error) => {
  BotLogger.log.error(error);
})

client.login(process.env.BOT_TOKEN);