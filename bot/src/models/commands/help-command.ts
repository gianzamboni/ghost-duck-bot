import { BotCommand, TextCommand } from '@abstracts/bot-command'
import { StringFormatter } from '@models/helpers/string-formatter';
import { Bot } from '@models/bot';
import { CommandDescription } from '@models/command-description';

export class HelpCommand extends TextCommand {

  private readonly bot: Bot;
  private helpText: string;

  constructor(bot: Bot) {
    super('help', ['command']);
    this.bot = bot;
    this.helpText=''
  }

  public async exec(args : string[]): Promise<string> {
    if(args.length == 0) return await this.fullDescription();
    return await this.descriptionFor(args[0]);
  }

  public getDescription(): CommandDescription {
    return new CommandDescription().addLine('Te explico que hace cada comando');
  }

  private async descriptionFor(commandName: string) {
    let command: BotCommand = this.bot.textCommands[commandName];
    if(!command) return 'No se hacer eso';

    // TODO: Make sound and reaction to respond with gifs and sound name
    return (await command.getDescription()).prettyPrint(0);
  }

  private async fullDescription(): Promise<string> {
    this.helpText = new StringFormatter('pedile ayuda a tu vieja').strikethrough().text;
    this.helpText = `${this.helpText} you can use any of the following commands by prefixing a "${this.bot.prefix}" before them:\n`;
    await this.addDescriptionBatch(this.bot.textCommands);

    this.helpText = this.helpText.concat(`\nI also react to some of your messages by sending a gif if they contain some of the following strings (or similiar):\n`);
    this.addReactionBatch(this.bot.reactions);
    this.helpText = this.helpText.concat(`\nTambien puedo reproducir estos sonido:\n`);
    this.addNameBatch(this.bot.soundCommands);

    return this.helpText;
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