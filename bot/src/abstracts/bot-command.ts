import { Message } from 'discord.js';
import { CommandDescription } from '@models/command-description';

export abstract class BotCommand {

  public readonly name: string;
  public parameters: string[];
  protected _description: CommandDescription;

  constructor(name: string, parameters: string[] = []) {
    this.name = name;
    this.parameters = parameters;
    this._description = new CommandDescription();
  }

  public description(tabs: number = 0) {
    return this._description.prettyPrint(tabs);
  }

  public abstract exec(message: Message) : void;
}