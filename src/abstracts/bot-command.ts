import { Message } from 'discord.js';

import { StringFormatter } from "../helpers/string-formatter";

export abstract class BotCommand {

  public readonly name: string;
  public description: string[];
  public readonly parameters: string[] | undefined;

  constructor(name: string, description?: string[] , parameters?: string[]) {
    this.name = name;
    this.description = description ? description : [];
    this.parameters = parameters;
  }

  public addLineToDescription(line: string): void {
    this.description.push(line);
  }

  public formattedDescription(prefixedTabs: number): string {
    let multipleTabs = '\t'.repeat(prefixedTabs);
    let result = this.description.reduce((current, line) => current.concat(`${multipleTabs}${line}\n`), '')
    return result;
  }

  public addArrayToDescription(array: any[]): void {
      let newLine = '\t' + StringFormatter.parseArray(array, ['italic']);
      this.addLineToDescription(newLine);
  }

  public abstract shouldExec(message: Message): boolean;
  public abstract exec(message: Message) : void;
}