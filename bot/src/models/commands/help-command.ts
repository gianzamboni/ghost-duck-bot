import { Message } from 'discord.js';

import { BotCommand } from '@abstracts/bot-command'
import { StringFormatter } from '@helpers/string-formatter';
import { CommandManager } from '@models/command-manager';

export class HelpCommand extends BotCommand {

  private readonly commandManager: CommandManager;
  private helpText: string;

  constructor(commandManager: CommandManager) {
    super('help', ['I will show you everything I can do']);
    this.commandManager = commandManager;
    this.helpText=''
  }

  exec(message: Message): void {
    this.helpText = StringFormatter.format('pedile ayuda a tu vieja', ['strikethrough']);
    this.helpText = `${this.helpText} you can use any of the following commands by prefixing a "${this.commandManager.prefix}" before them:\n`;
    this.addDescriptionBatch(this.commandManager.prefixedCommands);

    this.helpText = this.helpText.concat(`\nI also react to some of your messages by sending a gif if they contain some of the following strings (or similiar):\n`);
    this.addReactionBatch(this.commandManager.reactions);
    this.helpText = this.helpText.concat(`\nTambien puedo reproducir estos sonido:\n`);
    this.addNameBatch(this.commandManager.soundCommands);
    message.reply(this.helpText, {
      split: true
    });
  }

  private addDescriptionBatch(commandList: { [key: string]: BotCommand }): void {
    for (let command in commandList) {
      this.addDescription(commandList[command]);
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
    commandHelpText = commandHelpText.concat(command.description(2));

    this.helpText = this.helpText.concat(`${commandHelpText}\n`);
  }

  private addReactionBatch(reactions: BotCommand[]){
    let reactionNames = reactions.map(reaction => reaction.name).join(', ');
    this.helpText = this.helpText.concat(`\t\t${StringFormatter.format(reactionNames, ['italic'])}`);
  }

  private addNameBatch(commandList: { [key: string]: BotCommand }): void {
    let names = Object.keys(commandList).join(', ');
    this.helpText = this.helpText.concat(`\t\t${StringFormatter.format(names, ['italic'])}`);
  }

}