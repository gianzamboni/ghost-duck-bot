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
      "esta": new EstaCommand()
    };
  }

  private setReactions(): void {
    this.reactions = [
      new ReactionCommand('awa', /^.*a+[ ]*w+[ ]*a+.*$/i, 'https://i.imgur.com/V2h0XIV.gif'),
      new ReactionCommand('ewe', /^.*e+[ ]*w+[ ]*e+.*$/i, 'https://media1.tenor.com/images/fccd309c70e59df9fe27bd81b6429eb1/tenor.gif?itemid=12689104'),
      new ReactionCommand('iwi', /^.*i+[ ]*w+[ ]*i+.*$/i, 'https://media1.tenor.com/images/25934fdaaed5854e775526931b900cab/tenor.gif'),
      new ReactionCommand('owo', /^.*o+[ ]*w+[ ]*o+.*$/i, 'https://media1.tenor.com/images/f5bc4d03d3c78d585508945daead8a7e/tenor.gif'),
      new ReactionCommand('uwu', /^.*u+[ ]*w+[ ]*u+.*$/i, 'https://media.tenor.com/images/da03e7732c014219614dd7c03674f468/tenor.gif'),
      new ReactionCommand('si.', /^.*si\..*$/i, 'https://media1.tenor.com/images/4fa3a2b2ccdb4d629b065ac2b62a86f0/tenor.gif'),
      new ReactionCommand('no.', /^.*no\..*$/i, 'https://media0.giphy.com/media/W2zOnQonnYsNXnUxXo/giphy.gif')
    ];
  }
}