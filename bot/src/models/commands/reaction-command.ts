import { Message } from 'discord.js';
import { BotCommand } from '@abstracts/bot-command';


export class ReactionCommand extends BotCommand {
  private readonly regex: RegExp;
  private readonly filename: string;
  constructor(name: string, regex: RegExp, filename: string) {
    super(name);
    this.regex = regex;
    this.filename = filename;
  }

  public exec(message: Message) {
    if (message.content.match(this.regex)) {
      message.channel.send({
        files: [this.filename]
       });
    }
  }
}