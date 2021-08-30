import { CommandDescription } from '@models/command-description';
import { MessageEmbed } from 'discord.js';

export abstract class BotCommand {

  public readonly name: string;
  public parameters: string[];

  constructor(name: string, parameters: string[] = []) {
    this.name = name;
    this.parameters = parameters;
  }

  public abstract getDescription() : CommandDescription | Promise<CommandDescription>;
  public abstract exec(args: any) : Promise<any> | void;
}

export abstract class TextCommand extends BotCommand {
  public abstract exec(args: string[]) : Promise<string | MessageEmbed >;
}