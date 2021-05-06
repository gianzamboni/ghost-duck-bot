import { Message } from 'discord.js';
import { CommandDescription } from '@models/command-description';
export abstract class BotCommand {

  public readonly name: string;
  public readonly parameters: string[];
  public description: CommandDescription;

  constructor(name: string, parameters: string[] = []) {
    this.name = name;
    this.parameters = parameters;
    this.description = new CommandDescription();
  }

  public abstract shouldExec(message: Message): boolean;
  public abstract exec(message: Message) : void;
}