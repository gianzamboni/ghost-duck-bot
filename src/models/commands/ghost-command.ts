import { Message, MessageEmbed } from 'discord.js';

import { Evidences } from "../db-models/evidences";
import { GhostTypes } from "../db-models/ghost-types";
import { BotCommand } from "../../abstracts/bot-command";
import { StringFormatter } from "../../helpers/string-formatter";
import { Evidence } from "../../interfaces/evidence";
import { GhostType } from "../../interfaces/ghost-type";

export class GhostCommand extends BotCommand {

  constructor() {
    super("ghost", [`I will give you information about the ghost type *ghost_type* that could be useful during a phasmophobia ghost hunt`], ['ghost_type']);

    this.addLineToDescription("This are the ghost types I know:");
    this.addGhostTypeToDescription();

  }

  async addGhostTypeToDescription(): Promise<void> {
      let ghostTypes = await GhostTypes.all({
        attr: ['name']
      });
      
      let newLine = '\t ';
      ghostTypes.forEach((type: GhostType, index: number) => {
        let italicName = StringFormatter.format(type.name, ['italic']);
        newLine = newLine.concat(italicName);

        let separator = ', ';
        if(index == ghostTypes.length - 1){
          separator = '.';
        }

        newLine = newLine.concat(separator);

      })

      this.addLineToDescription(newLine);
  }

  shouldExec(message: Message): boolean {
    return message.content.startsWith(this.name);
  }

  async exec(message: Message): Promise<any> {
    let args = message.content.split(' ');
    let reply: string | MessageEmbed = 'You have to tell me which ghost type you need info about';

    if(args.length < 2) {
      message.reply('tenés que decirme qué fantasma querés ');
    } else {
      let ghostType = await GhostTypes.get(args[1].toLowerCase());
      reply = "La cagaste amig@, no hay ningún fantasma que se llame así";

      if(ghostType){
        let ghostEvidence = await Evidences.givenBy(ghostType);
        reply = this.generateEmbedFor(ghostType, ghostEvidence);
      }

      message.channel.send(reply);
    }
  }

  private generateEmbedFor(ghostType: GhostType, evidences: Evidence[]): MessageEmbed {
    let name = ghostType.name.toUpperCase();

    let message = new MessageEmbed().setColor('#666666')
      .setTitle(name);

    evidences.forEach( (evidence, index) => {
      let capitalizedEvidence = StringFormatter.format(evidence.name, ['capitalize']);
      message.addField(`Evidence ${index}`, capitalizedEvidence, true);
    })

    message.addFields(
        { name: 'Strength', value: ghostType.strength },
        { name: 'Weakness', value: ghostType.weakness },
        { name: 'Details', value: ghostType.details},
      )
      .setFooter('Tu vieja es tan fea que la usaron de referencia para los fantasmas de phasmophobia', 'https://store-images.s-microsoft.com/image/apps.10672.14459324830184757.115b4ae2-cd13-432d-afb1-065cbec4bc76.dda75efc-b359-434e-8a3a-c986f1ccbc23?mode=scale&q=90&h=270&w=270&background=%23FFFFFF');

    return message;
  }

};