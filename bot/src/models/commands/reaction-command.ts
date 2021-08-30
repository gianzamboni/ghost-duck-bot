import { Message } from 'discord.js';
import { BotCommand } from '@abstracts/bot-command';
import { CommandDescription } from '@models/command-description';


export class ReactionCommand extends BotCommand {
  private readonly _regex: RegExp;
  private readonly filename: string;

  constructor(name: string, regex: RegExp, filename: string) {
    super(name);
    this._regex = regex;
    this.filename = filename;
  }

  get pattern() : RegExp {
    return this._regex;
  };

  public getDescription(): CommandDescription {
    return new CommandDescription().addLine(`Envio el gif ${this.filename} cuando encuentro la expresion ${this._regex}`);
  }

  public exec(message: Message) : void  {
    message.channel.send({
      files: [this.filename]
    });
  }
}