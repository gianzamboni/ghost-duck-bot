import { Message } from 'discord.js';

import { BotCommand } from '@abstracts/bot-command'
import { StringFormatter } from '@models/helpers/string-formatter';
import { CommandManager } from '@models/command-manager';

export class HelpCommand extends BotCommand {

  private readonly commandManager: CommandManager;
  private helpText: string;

  constructor(commandManager: CommandManager) {
    super('help', ['I will show you everything I can do']);
    this.commandManager = commandManager;
    this.helpText=''
  }

  public async exec(message: Message) {
    this.helpText = new StringFormatter('pedile ayuda a tu vieja').strikethrough().text;
    this.helpText = `${this.helpText} you can use any of the following commands by prefixing a "${this.commandManager.prefix}" before them:\n`;
    await this.addDescriptionBatch(this.commandManager.prefixedCommands);

    this.helpText = this.helpText.concat(`\nI also react to some of your messages by sending a gif if they contain some of the following strings (or similiar):\n`);
    this.addReactionBatch(this.commandManager.reactions);
    this.helpText = this.helpText.concat(`\nTambien puedo reproducir estos sonido:\n`);
    this.addNameBatch(this.commandManager.soundCommands);
    message.reply(this.helpText, {
      split: true
    });
  }

  private async addDescriptionBatch(commandList: { [key: string]: BotCommand }) {
    for (let command in commandList) {
      await this.addDescription(commandList[command]);
    }
  }

  private async addDescription(command: BotCommand){
    let boldCommandName = new StringFormatter(command.name).bold().text;
    let commandHelpText = `\t${boldCommandName}`;

    if(command.parameters){
      let parameters = command.parameters?.map((parameter) => {
        return new StringFormatter(parameter).italic().text;
      }).join(' ');

      commandHelpText = commandHelpText.concat(`  ${parameters}`);
    }

    commandHelpText = commandHelpText.concat(`:\n`);
    commandHelpText = commandHelpText.concat((await command.getDescription()).prettyPrint(2));

    this.helpText = this.helpText.concat(`${commandHelpText}\n`);
  }

  private addReactionBatch(reactions: BotCommand[]){
    let reactionNames = reactions.map(reaction => reaction.name).join(', ');
    this.helpText = this.helpText.concat(`\t\t${new StringFormatter(reactionNames).italic().text}`);
  }

  private addNameBatch(commandList: { [key: string]: BotCommand }): void {
    let names = Object.keys(commandList).join(', ');
    this.helpText = this.helpText.concat(`\t\t${new StringFormatter(names).italic().text}`);
  }

}