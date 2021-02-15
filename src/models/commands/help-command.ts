import { Message } from 'discord.js';

import { BotCommand } from '../../abstracts/bot-command'
import { StringFormatter } from '../../helpers/string-formatter';
import { CommandManager } from '../../models/command-manager';

export class HelpCommand extends BotCommand {

  private readonly commandManager: CommandManager;
  private helpText: string;

  constructor(commandManager: CommandManager) {
    super('help', ['I will show you everything I can do']);
    this.commandManager = commandManager;
    this.helpText=''
  }

  shouldExec(message: Message): boolean {
    return message.content === this.name;
  }

  exec(message: Message): void {
    this.helpText = StringFormatter.format('pedile ayuda a tu vieja', ['strikethrough']);
    this.helpText = `${this.helpText} you can use any of the following commands by prefixing a "${this.commandManager.prefix}" before them:\n`;
    this.addDescriptionBatch(this.commandManager.commands);

    message.reply(this.helpText, {
      split: true
    });
  }

  private addDescriptionBatch(commandList: BotCommand[]): void {
    for (let command of commandList) {
      this.addDescription(command);
    }
  }

  private addDescription(command: BotCommand){
    let boldCommandName = StringFormatter.format(command.name, ['bold']);
    let commandHelpText = `\t${boldCommandName}`;

    if(command.parameters){
      let parameters = command.parameters?.map((parameter) => {
        return StringFormatter.format(parameter, ['italic']);
      }).join(' ');

      commandHelpText = commandHelpText.concat(`  ${parameters}`);
    }

    commandHelpText = commandHelpText.concat(`:\n`);
    commandHelpText = commandHelpText.concat(command.formattedDescription(2));

    this.helpText = this.helpText.concat(`${commandHelpText}\n`);
  }
}