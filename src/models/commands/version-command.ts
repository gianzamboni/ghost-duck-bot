import { BotCommand } from '@abstracts/bot-command';
import { Message } from 'discord.js';

export class VersionCommand extends BotCommand {

  private version: string;

  constructor(version: string) {
    super('version');
    this.version = version;
    this.description.addLine('Te digo que version estas usando');
  }

  public exec(message: Message) {
    message.reply(`estás usando la version ${this.version} del bot.`);
  }
}