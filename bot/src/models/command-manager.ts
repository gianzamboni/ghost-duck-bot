import { Message } from 'discord.js';

import { HelpCommand } from '@models/commands/help-command';
import { EstaCommand } from '@models/commands/esta-command';
import { ReactionCommand } from '@models/commands/reaction-command';
import { CluesCommand } from "@models/commands/phasmophobia/clues-command";
import { GhostCommand } from '@models/commands/phasmophobia/ghost-command';
import { BotCommand } from "@abstracts/bot-command";


export class CommandManager {
  public readonly prefix: string;
  public reactions: BotCommand[] = [];
  public prefixedCommands: { [key: string]: BotCommand } = {};

  constructor(prefix: string){
    this.prefix = prefix;
    this.setPrefixedCommands();
    this.setReactions();

  };

  public process(message: Message): void {
    if(message.author.bot) return;

    if (message.content.startsWith(this.prefix)) {
      let args = message.content.substring(this.prefix.length).split(' ');
      let command = args.shift();
      if(command && this.prefixedCommands[command]) {
        this.prefixedCommands[command].exec(message);
      }
    } else {
      for(let reaction of this.reactions) {
        reaction.exec(message);
      }
    }
  }

  private setPrefixedCommands() : void {
    this.prefixedCommands = {
      "help": new HelpCommand(this),
      "clues": new CluesCommand(),
      "ghost": new GhostCommand(),
      "esta": new EstaCommand(),
    };
  }

  private setReactions(): void {
    this.reactions = [
      new ReactionCommand('awa', /^.*a+[ ]*w+[ ]*a+.*$/i, 'static/gifs/awa.gif'),
      new ReactionCommand('ewe', /^.*e+[ ]*w+[ ]*e+.*$/i, 'static/gifs/ewe.gif'),
      new ReactionCommand('iwi', /^.*i+[ ]*w+[ ]*i+.*$/i, 'static/gifs/iwi.gif'),
      new ReactionCommand('owo', /^.*o+[ ]*w+[ ]*o+.*$/i, 'static/gifs/owo.gif'),
      new ReactionCommand('uwu', /^.*u+[ ]*w+[ ]*u+.*$/i, 'static/gifs/uwu.gif'),
      new ReactionCommand('si.', /^.*si\..*$/i, 'static/gifs/si.gif'),
      new ReactionCommand('no.', /^.*no\..*$/i, 'static/gifs/no.gif'),
      new ReactionCommand('fire', /^.*(ardas|arder|burn|fire|fuego|incendio|infierno|matar|mueras|quemar).*$/i, 'static/gifs/fuego.gif'),
      new ReactionCommand('fire', /^.*[ ]*aa+[ ]*.*$/i, 'static/gifs/aaa.gif')
    ];
  }
}