import { MessageEmbed } from 'discord.js';

import { BotCommand } from '@abstracts/bot-command';
import { StringFormatter } from '@models/helpers/string-formatter';
import { Evidence } from '@interfaces/evidence';
import { GhostType } from '@interfaces/ghost-type';
import { Evidences } from '@models/db-entities/evidences';
import { GhostTypes } from '@models/db-entities/ghost-types';
import { CommandDescription } from '@models/command-description';


export class GhostCommand extends BotCommand {

  constructor() {
    super("ghost", ["ghost"]);
  }

  public async getDescription() : Promise<CommandDescription> {
    let description = new CommandDescription();
    description.addLines([
      `I will give you information about the ghost type *ghost_type* that could be useful during a phasmophobia ghost hunt.`,
      "This are the ghost types I know:"
    ]);

    let ghostTypes = await GhostTypes.all({
      attr: ['name']
    });
    description.addList(ghostTypes.map((ghostType) => ghostType.name));

    return description;

  }

  public async exec(args: string[]): Promise<string | MessageEmbed > {
    if(args.length === 0) return 'No entendiste nada, tenés que decirme qué fantasma querés.';

    let ghostType = await GhostTypes.get(args[0].toLowerCase());
    if(!ghostType) return "La cagaste amig@, no hay ningún fantasma que se llame así";

    let ghostEvidence = await Evidences.givenBy(ghostType);
    return this.generateEmbedFor(ghostType, ghostEvidence);
  }

  private generateEmbedFor(ghostType: GhostType, evidences: Evidence[]): MessageEmbed {
    let name = ghostType.name.toUpperCase();

    let message = new MessageEmbed().setColor('#666666')
      .setTitle(name);

    evidences.forEach( (evidence, index) => {
      let capitalizedEvidence = new StringFormatter(evidence.name).wordUpper().text;
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