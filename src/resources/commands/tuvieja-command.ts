import { Message, TextChannel } from "discord.js";

import { BotCommand } from "@abstracts/bot-command";

export interface EstaArgs {
  message: string;
  channel: TextChannel;
}

export class TuViejaCommand implements BotCommand {

  private readonly _insults: string[];

  constructor() {
    this._insults = [
      'tu vieja vino el otro dia y ahora vas a tener un hermanito mitad robot',
      'tu vieja es tan fea que la usaron de referencia para los fantasmas de phasmophobia',
      'tu vieja es como la capa de ozono, esta cada dia más abierta',
      'tu vieja es como una motosierra, no deja palo parado',
      'tu vieja es como el caño del colectivo, todos la tocan',
      'tu vieja es como un paquete de yerba, mientras mas la sacudis, más polvo sale',
      'tu vieja es como un fotografo distraido, se le caen todos los rollos',
      'tu vieja es como un colectivo lleno, se come todas las paradas',
      'tu vieja es como un vaso de agua, no se le niega a nadie',
      'tu vieja es como los semaforos, despues de las 12 no la respeta nadie',
      'tu vieja es como la luna nueva, va de cuarto en cuarto y siempre termina llena',
      'tu vieja es como las tortugas, le gusta dormir con la cabeza adentro',
      'tu vieja es como una licuadora, le entran tres bananas y un litro de leche',
      'tu vieja es como la cinta de embalaje, cuesta despegarla del paquete',
      'tu vieja es como los relojes de arena, se la dan vuelta cada media hora'
    ]
  }

  get description(): string {
    return 'Insulto a tu vieja';
  }

  async reply(message: Message) : Promise<void> {
    message.reply(this._insults[Math.floor(Math.random()*this._insults.length)]);
  }
}