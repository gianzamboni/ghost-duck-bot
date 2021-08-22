import { Message } from 'discord.js';
import { CommandDescription } from '@models/command-description';

export abstract class BotCommand {

  public readonly name: string;
  public parameters: string[];

  constructor(name: string, parameters: string[] = []) {
    this.name = name;
    this.parameters = parameters;
  }

  public getDescription() : CommandDescription | Promise<CommandDescription> {
    return new CommandDescription();
  };

  public abstract exec(message: Message) : void;
}