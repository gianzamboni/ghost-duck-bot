import { Message } from "discord.js";

import { BotCommand } from "../../abstracts/bot-command";

export class EstaCommand extends BotCommand {

  constructor()   {
    super("esta", ['Reproduce una parte de Quiereme de Jean Carlo'], ['version'])
  }

  shouldExec(message: Message): boolean {
    let matches = message.content.match(/^esta( )?(full|fast)?$/i);
    return  matches !== null
  }

  async exec(message: Message) : Promise<void> {
    if(!message.member?.voice.channel) {
      message.channel.send("Deja de trolear, forro. Necesitas estar conectado al canal de voz para usarme");  
    } else {
      let params: string[] = message.content.split(" ");
      params.shift();

      if(params.length <= 1) {
        let song = this.getSong(params);
        if(song){
          const connection = await message.member.voice.channel.join();
          message.channel.send({
           files: ['static/esta.gif']
          });
          const dispatcher = connection.play(song);    
          dispatcher.on('finish', () => {
            connection.disconnect();
          }) 
        }   
      }
    }
  }

  private getSong(params: string[]): string | null {
    if(params.length === 0) return 'static/esta.mp3';

    switch(params[0]) {
      case "full":
        return 'static/esta-full.mp3';
      case "fast":
        return 'static/esta-fast.mp3';
      default:
        return null;
    }
  }

};