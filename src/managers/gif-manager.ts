import { Collection, Message } from 'discord.js';

import { BotLogger } from '@helpers/bot-logger';
import { Gif } from '@resources/gif';

export class GifManager {

  private readonly _gifs: Collection<string, Gif>;

  constructor() {
    this._gifs = new Collection<string, Gif>()
      .set('awa',  new Gif(/^.*a+[ ]*w+[ ]*a+.*$/i, 'static/gifs/awa.gif'))
      .set('ewe',  new Gif(/^.*e+[ ]*w+[ ]*e+.*$/i, 'static/gifs/ewe.gif'))
      .set('iwi',  new Gif(/^.*i+[ ]*w+[ ]*i+.*$/i, 'static/gifs/iwi.gif'))
      .set('owo',  new Gif(/^.*o+[ ]*w+[ ]*o+.*$/i, 'static/gifs/owo.gif'))
      .set('uwu',  new Gif(/^.*u+[ ]*w+[ ]*u+.*$/i, 'static/gifs/uwu.gif'))
      .set('si.',  new Gif(/^.*si\..*$/i, 'static/gifs/si.gif'))
      .set('no.',  new Gif(/^.*no\..*$/i, 'static/gifs/no.gif'))
      .set('fire', new Gif(/^.*(ardas|arder|burn|fire|fuego|incendio|infierno|matar|mueras|quemar).*$/i, 'static/gifs/fuego.gif'))
      .set('aaaah', new Gif(/^.*[ ]*aa+[ ]*.*$/i, 'static/gifs/aaa.gif'));
  };

  public get gifs(): string[] {
    return Array.from(this._gifs.keys());
  }

  public reply(message : Message ) {
    for(let [ name, gif ] of this._gifs) {
      if(gif.shouldReplyTo(message.content)) {
        message.channel.send({
          files: [ gif.file ]
        })
        BotLogger.log.info(`Reacted to ${message.content} with ${name}`)
      }
    }
  }
}