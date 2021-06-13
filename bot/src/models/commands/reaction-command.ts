import { BotCommand } from '@abstracts/bot-command';
import { Message } from 'discord.js';

export class ReactionCommand extends BotCommand {
  private readonly regex: RegExp;
  private readonly url: string;
  constructor(name: string, regex: RegExp, url: string) {
    super(name);
    this.regex = regex;
    this.url = url;
  }
  
  exec(message: Message) {
    if (message.content.match(this.regex)) {
      message.channel.send(this.url);
    }
  }
}