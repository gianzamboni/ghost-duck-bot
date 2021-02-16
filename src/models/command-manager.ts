import { Message } from "discord.js";

import { CluesCommand } from "./commands/clues-command";
import { GhostCommand } from './commands/ghost-command';
import { HelpCommand } from './commands/help-command';
import { MapCommand } from './commands/map-command';
import { BotCommand } from "../abstracts/bot-command";

export class CommandManager {
  public readonly prefix: string;
  public readonly commands: BotCommand[];

  constructor(prefix: string){
    this.prefix = prefix;

    this.commands = [
      new HelpCommand(this),
      new CluesCommand(),
      new GhostCommand(),
      new MapCommand()
    ];
  };

  public process(message: Message): void {
    if(message.author.bot) return;

    if (message.content.startsWith(this.prefix)) {
      message.content = message.content.substring(this.prefix.length);
      this.execCommandFor(message, this.commands);
    }
  }

  public execCommandFor(message: Message, commands : BotCommand[]): void {
    for (let command of commands) {
      if(command.shouldExec(message)){
        command.exec(message);
        break;
      }
    }
  }
}