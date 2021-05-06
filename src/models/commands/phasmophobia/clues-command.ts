import { Message, MessageEmbed } from 'discord.js';

import { BotCommand } from '@abstracts/bot-command';
import { StringFormatter } from '@helpers/string-formatter'
import { GhostType } from '@interfaces/ghost-type';
import { Evidence } from '@interfaces/evidence';
import { Evidences } from '@models/db-entities/evidences';
import { GhostTypes } from '@models/db-entities/ghost-types';

export class CluesCommand extends BotCommand {

  constructor() {
    super("clues", ["clue"]);
    this.description.addLine("Given a space separated set of evidences, I will tell you all possible ghost types that you could be dealing with. The evidence can be any of the following, you may use its short name (which is shown between paranthesis):");
    
    this.addEvidenceToDescription();
  }

  async addEvidenceToDescription(): Promise<void> {
    let posibleEvidence = await Evidences.all();
    let formattedEvidence = posibleEvidence.map( (evidence) => {
      let evidenceName = StringFormatter.format(evidence.name, ['capitalize']);
      let evidenceShort =  StringFormatter.format(evidence.short_name, ['italic']);;
      return `${evidenceName} (${evidenceShort})`
    })   
    this.description.addList(formattedEvidence);
  };

  async exec(message: Message): Promise<void> {
    let args = message.content.split(" ").map((argument) => argument.toLowerCase());
    args.shift();

    if (args.length === 0) {
      message.channel.send('Dale, forro, conseguí una pista (o mejor dos) antes de pedirme ayuda.')
    } else if(args.length === 1) {
      message.channel.send('Bueh, una pista nomas?');
      this.replyWithoutAdvice(message, args[0]);
    } else {
      this.replyWithAdvice(message, args);
    }
  }

  private async replyWithAdvice(message: Message, evidences: string[]) {
    let posibleGhosts = await GhostTypes.thatGive(evidences, {
      attr: ['name', 'advice']
    });

    let missingEvidence = await this.getMissingEvidenceFor(posibleGhosts, evidences);
    let renderedMessage = this.renderAdvidceMessage(posibleGhosts, missingEvidence);
    message.channel.send(renderedMessage);
  }

  private async replyWithoutAdvice(message: Message, evidence: string) {
    let posibleGhosts = await GhostTypes.thatGive([evidence], {
      attr: ['name']
    });
    
    let evidences = await this.getMissingEvidenceFor(posibleGhosts, [evidence]);
    let renderedMessage = this.renderSimpleListEmbed(posibleGhosts, evidences);
    message.channel.send(renderedMessage);
  }

  private async getMissingEvidenceFor(ghosts: GhostType[], knownEvidences: string[]): Promise<Evidence[][]> {
    let promises: Promise<Evidence[]>[] = [];

    for(let ghostType of ghosts) {
      let promise = Evidences.givenBy(ghostType);
      promises.push(promise);
    }

    let missingEvidence = [];
    for(let promise of promises ) {
      let evidences = (await promise).filter( evidence => knownEvidences.indexOf(evidence.short_name) < 0 );
      missingEvidence.push(evidences)
    }
    return missingEvidence;
    
  }

  private renderSimpleListEmbed(ghosts: GhostType[], evidences: Evidence[][]): MessageEmbed {
    let message = new MessageEmbed().setColor('#666666')
      .setTitle('Aca tenes una lista de lo que podria ser :rolling_eyes:')
      .addFields([
        { name: "Ghost", value:'\u200b', inline: true},
        { name: "Missing Evidence 0", value:'\u200b', inline: true},
        { name: "Missing Evidence 1", value:'\u200b', inline: true},
      ]);

    ghosts.forEach((ghost, index) => {
      const data = this.getFormatedMissingEvidence(ghost, evidences[index], index);

      message.addFields([
        { name: '\u200b', value: data[0], inline: true},
        { name: '\u200b', value: data[1][0], inline: true},
        { name: '\u200b', value: data[1][1], inline: true},
      ]);
    });

    return message;
  }

  private renderAdvidceMessage(ghosts: GhostType[], evidences: Evidence[][]): MessageEmbed {
    let message = new MessageEmbed().setColor('#666666')
      .setTitle('Posibles ghosts')
      .setDescription('Given the clues you gave me, the ghost can be one of the following:')

    ghosts.forEach((ghost, index) => {

      let formattedEvidence = evidences[index].map((evidence) => StringFormatter.format(evidence.name, ['capitalize']));
      if(formattedEvidence.length === 0) formattedEvidence=["None"];

      message.addFields([
        { name: ghost.name.toUpperCase(), value: ghost.advice},
        { name: 'Missing Evidence', value: formattedEvidence, inline: true},
      ]);
    });

    return message;
  }

  private getFormatedMissingEvidence(ghost: GhostType, evidences: Evidence[], index: number): any[] {
    let format = ['capitalize', 'italic'];
    if(index % 2 == 1) format.push('bold');

    let ghostName =  StringFormatter.format(ghost.name, format);
    let capitalizedEvidence = evidences.map((evidence) => StringFormatter.format(evidence.name, format));
    return [ghostName, capitalizedEvidence]
  }

}
