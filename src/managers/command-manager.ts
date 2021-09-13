import { Collection, Message } from 'discord.js';

import { BotCommand } from "@abstracts/bot-command";
import { BotLogger } from '@helpers/bot-logger';
import { EstaCommand } from '@resources/commands/esta-command';
import { HelpCommand } from '@resources/commands/help-command';
import { TuViejaCommand } from '@resources/commands/tuvieja-command';

export class CommandManager {

  private readonly _commands: Collection<string, BotCommand>;

  public constructor() {
    this._commands = new Collection<string, BotCommand>();
    this.setCommands();
  };

  public get commandDescriptions(): Collection<string, string> {
    return this._commands.mapValues((command) => command.description);
  }

  public get help(): HelpCommand {
    return this._commands.get('help') as HelpCommand;
  }

  public reply(message : Message, bot_version: string ) {
    let args = message.content.split(" ");
    args.push(bot_version);

    let commandName = args.shift() as string;

    BotLogger.log.info(`${commandName} command requested`);

    if(!this._commands.has(commandName)) {
      BotLogger.log.info(`${commandName} does not exist`);
      message.reply('No se hacer eso');
      return;
    }

    BotLogger.log.info(`Executing ${commandName} command`)
    let command = this._commands.get(commandName) as BotCommand;
    command.reply(message, args);

  }

  private setCommands() {
    let helpCommand = new HelpCommand();

    this._commands
      .set('esta', new EstaCommand())
      .set('help', helpCommand)
      .set('tuvieja', new TuViejaCommand());
  }

}