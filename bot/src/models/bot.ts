import { readdirSync } from 'fs';
import { Message, MessageEmbed, TextChannel } from 'discord.js';

import { ReactionCommand } from '@models/commands/reaction-command';
import { CluesCommand } from "@models/commands/phasmophobia/clues-command";
import { GhostCommand } from "@models/commands/phasmophobia/ghost-command";
import { HelpCommand } from "@models/commands/help-command";
import { TuViejaCommand } from "@models/commands/tuvieja-command";
import { EstaCommand } from "@models/commands/esta-command";
import { BotCommand, TextCommand } from "@abstracts/bot-command";
import { SoundCommand } from './commands/sound-command';


export class Bot {
  public readonly prefix: string;
  public readonly soundPrefix: string;

  // TODO: Put all commands inton one single dictionary;
  public reactions: ReactionCommand[] = [];
  public textCommands: { [key: string]: TextCommand } = {};
  public soundCommands: { [key: string]: BotCommand } = {};

  constructor(){
    this.prefix = 'd!';
    this.soundPrefix = 's!';
    this.setTextCommands();
    this.setReactions();
    this.setSoundCommands();
  };

  public process(message: Message): void {
    if(message.author.bot) return;

    if (message.content.startsWith(this.prefix)) this.processTextCommand(message);
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

  private async processTextCommand(message: Message) : Promise<void> {
    let args = message.content.substring(this.prefix.length).split(' ');
    let command = args.shift() as string;

    if (this.textCommands[command]) {
      let reply : string | MessageEmbed = await this.textCommands[command].exec(args);
      message.reply(reply);
    } else {
      this.sendCantDoThatWarning(message.channel as TextChannel);
    }
  }

  private sendCantDoThatWarning(channel: TextChannel) {
    channel.send('No se hacer eso');
  }

  private processReaction(message: Message): void {
    for (let reaction  of this.reactions) {
      if (message.content.match(reaction.pattern)) {
        console.log(reaction.name);
        reaction.exec(message);
      }
    }
  }

  private setTextCommands() : void {
    this.textCommands = {
      "help": new HelpCommand(this),
      "clues": new CluesCommand(),
      "ghost": new GhostCommand(),
      "tuvieja": new TuViejaCommand()
    };
  }

  private setSoundCommands(): void {
    let soundFiles = readdirSync(`static/mp3/`);
    soundFiles.map((filename) => {
      let name = filename.split('.')[0];
      this.soundCommands[name] = new SoundCommand(name, `${__dirname}/../static/mp3/${filename}`);
    });
    this.soundCommands['esta'] = new EstaCommand();
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
      new ReactionCommand('aaaah', /^.*[ ]*aaa+[ ]*.*$/i, 'static/gifs/aaa.gif')
    ];
  }
}