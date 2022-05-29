import {  Message } from 'discord.js';

import { GifManager } from '@managers/gif-manager';
import { SoundManager } from '@managers/sound-manager';
import { CommandManager } from '@managers/command-manager';

export class GhostDuckBot {

  private readonly _version : string;

  private readonly _commandPrefix: string;
  private readonly _soundPrefix: string;

  private _commandManager: CommandManager;
  private _gifManager: GifManager;
  private _soundManager: SoundManager;

  constructor(){
    this._version = 'v4.0.1';

    this._commandPrefix = 'd!';
    this._soundPrefix = 's!';

    this._gifManager = new GifManager();
    this._soundManager = new SoundManager();
    this._commandManager = new CommandManager();

    this.setHelpTexts();

  };

  public process(message: Message): void {
    if(message.author.bot) return;
    if(process.env.NODE_ENV === 'production' && message.channel.id === '839157716513456179') return;

    let content = message.content;
    if (content.startsWith(this._commandPrefix)) {
      message.content = content.substring(this._commandPrefix.length);
      this._commandManager.reply(message, this.version);

    } else if (content.startsWith(this._soundPrefix)) {
      message.content = content.substring(this._soundPrefix.length);
      this._soundManager.reply(message);

    } else {
      this._gifManager.reply(message);
    }
  }

  get version(): string {
    return this._version;
  }

  private setHelpTexts() : void {

    this._commandManager.help.registerWithDescription('Comandos básicos\t\t d!',
      `Los usás poniendo una "${this._commandPrefix}" de pato adelante y son los siguientes:`,
      this._commandManager.commandDescriptions);

    this._commandManager.help.register('Soniditos\t\t s!',
      `Los usás poniendo una ${this._soundPrefix} de sonidito adelante y son los siguientes:`,
      ':musical_note:',
      this._soundManager.sounds)

    this._commandManager.help.register('Reacciones',
      'Se usan solos, el bot lee todos los mensajes y si encuentra ciertas palabras los responde con un gif. Les puse nombre solo para poder enumerarlas:',
      '\u200B',
      this._gifManager.gifs);

  }

}