import { Message } from "discord.js";

import { BotCommand } from "../abstracts/bot-command";
import { CluesCommand } from "../commands/clues-command";
import { GhostCommand } from '../commands/ghost-command';
import { HelpCommand } from '../commands/help-command';
import { PhasmoDataService } from "../services/phasmo-data";

export class CommandManager {
  public readonly prefix: string;
  public readonly commands: BotCommand[];

  private readonly phasmoDataService: PhasmoDataService;

  constructor(prefix: string){
    this.prefix = prefix;

    this.phasmoDataService = new PhasmoDataService();

    this.commands = [
      new HelpCommand(this),
      new GhostCommand(this.phasmoDataService),
      new CluesCommand(this.phasmoDataService),
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