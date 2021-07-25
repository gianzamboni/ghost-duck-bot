import { readdirSync } from 'fs';
import { Message } from 'discord.js';

import { HelpCommand } from '@models/commands/help-command';
import { EstaCommand } from '@models/commands/esta-command';
import { ReactionCommand } from '@models/commands/reaction-command';
import { CluesCommand } from "@models/commands/phasmophobia/clues-command";
import { GhostCommand } from '@models/commands/phasmophobia/ghost-command';
import { BotCommand } from "@abstracts/bot-command";
import { SoundCommand } from './commands/sound-command';


export class CommandManager {
  public readonly prefix: string;
  public readonly soundPrefix: string;

  public reactions: BotCommand[] = [];
  public prefixedCommands: { [key: string]: BotCommand } = {};
  public soundCommands: { [key: string]: BotCommand } = {};

  constructor(){
    this.prefix = 'd!';
    this.soundPrefix = 's!';
    this.setPrefixedCommands();
    this.setReactions();
    this.setSoundCommands();
  };

  public process(message: Message): void {
    if(message.author.bot) return;

    if (message.content.startsWith(this.prefix)) this.processCommandFrom(this.prefixedCommands, message);
    else if (message.content.startsWith(this.soundPrefix)) this.processCommandFrom(this.soundCommands, message);
    else this.processReaction(message);
  }

  private processCommandFrom(commandDict: { [key: string]: BotCommand }, message: Message) : void {
    let args = message.content.substring(this.prefix.length).split(' ');
    let command = args.shift();
    if(command && commandDict[command]) {
      commandDict[command].exec(message);
    } else {
      message.channel.send("No se hacer eso");
    }
  }

  private processReaction(message: Message): void {
    for(let reaction of this.reactions) {
      reaction.exec(message);
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

  private setSoundCommands(): void {
    let soundFiles = readdirSync('static/mp3');
    soundFiles.map((filename) => {
      let name = filename.split('.')[0];
      this.soundCommands[name] = new SoundCommand(name, `${__dirname}/../static/mp3/${filename}`);
    });
  };

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
      new ReactionCommand('aaaah', /^.*[ ]*aa+[ ]*.*$/i, 'static/gifs/aaa.gif')
    ];
  }
}