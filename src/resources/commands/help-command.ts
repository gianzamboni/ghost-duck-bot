import { BotCommand } from '@abstracts/bot-command'
import { Collection, ColorResolvable, Message, MessageEmbed } from 'discord.js';

export class HelpCommand implements BotCommand {

  private _commandCollections: MessageEmbed[];
  private _lastColorUsed : [number, number, number];

  constructor() {
    this._commandCollections = [];
    this._lastColorUsed = [0, 0, 0];
  };

  get description(): string {
    return 'Te digo qué puedo hacer';
  }

  public reply(message: Message, args: string[]) {
    message.reply({
      content:`~~¿Por qué no le pedis ayuda a tu vieja?~~ Estás usando la version ${args[args.length-1]}. Tengo varios tipos de comandos, ahora te los listo`,
      embeds: this._commandCollections
    });
  }

  public register(type: string, typeDescription: string, columnName: string, commands : string[]) {
    let newEmbed = this.createBasicEmbed(type, typeDescription);

    let commandsPerColumn = Math.ceil(commands.length / 3);
    let columns = [];

    while(columns.length != 3) {
      let start = commandsPerColumn *  columns.length
      let end   = start + commandsPerColumn;

      let newColumn = commands.slice(start, end);
      columns.push(newColumn);
    }

    for(let column of columns) {
      let columnString = column.join('\n');
      newEmbed.addField(columnName, columnString, true);
    }

    this._commandCollections.push(newEmbed);
  }

  public registerWithDescription(type: string, typeDescription: string, commands: Collection<string, string>) {
    let newEmbed = this.createBasicEmbed(type, typeDescription);

    for(let [commandName, description] of commands) {
      newEmbed.addField(commandName, description);
    }

    this._commandCollections.push(newEmbed);
  }

  private createBasicEmbed(type: string, typeDescription: string): MessageEmbed {
    return new MessageEmbed()
    .setColor(this.generateColor())
    .setTitle(type)
    .setDescription(typeDescription);
  }

  private generateColor(): ColorResolvable {
    let index = this._commandCollections.length;
    this._lastColorUsed[index % 3] = Math.min(255, this._lastColorUsed[index % 3] + 255);
    return this._lastColorUsed as ColorResolvable;
  }
}