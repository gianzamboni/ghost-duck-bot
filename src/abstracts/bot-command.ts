import { Message } from 'discord.js';

export abstract class BotCommand {
  public abstract get description() : string;
  public abstract reply(message: Message, arg: string[] | undefined) : void | Promise<void>;
}