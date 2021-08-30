import { MessageEmbed } from 'discord.js';

import { TextCommand } from '@abstracts/bot-command';
import { StringFormatter } from '@models/helpers/string-formatter'
import { GhostType } from '@interfaces/ghost-type';
import { Evidence } from '@interfaces/evidence';
import { Evidences } from '@models/db-entities/evidences';
import { GhostTypes } from '@models/db-entities/ghost-types';
import { CommandDescription } from '@models/command-description';

export class CluesCommand extends TextCommand {

  constructor() {
    super("clues", ["clueList"]);
  }

  public async getDescription(): Promise<CommandDescription> {
    let description = new CommandDescription();
    description.addLine("Given a space separated set of evidences, I will tell you all possible ghost types that you could be dealing with. The evidence can be any of the following, you may use its short name (which is shown between paranthesis):");

    let evidenceList = (await Evidences.all()).map( (evidence) => {
      let evidenceName = new StringFormatter(evidence.name).wordUpper().text;
      let evidenceShort =  new StringFormatter(evidence.short_name).italic().text;
      return `${evidenceName} (${evidenceShort})`
    })

    description.addList(evidenceList);

    return description;
  }

  public async exec(args: string[]): Promise<string | MessageEmbed> {
    if (args.length === 0) {
      return 'Dale forr@, conseguí una pista (o mejor dos) antes de pedirme ayuda.';
    } else if(args.length === 1) {
      return await this.replyWithoutAdvice(args[0]);
    }

    return await this.replyWithAdvice(args);
  }

  private async replyWithAdvice(evidences: string[]) : Promise<MessageEmbed> {
    let posibleGhosts = await GhostTypes.thatGive(evidences, {
      attr: ['name', 'advice']
    });

    let missingEvidence = await this.getMissingEvidenceFor(posibleGhosts, evidences);
    return this.renderAdvidceMessage(posibleGhosts, missingEvidence);
  }

  private async replyWithoutAdvice(evidence: string) : Promise<MessageEmbed> {
    let posibleGhosts = await GhostTypes.thatGive([evidence], {
      attr: ['name']
    });

    let evidences = await this.getMissingEvidenceFor(posibleGhosts, [evidence]);
    return this.renderSimpleListEmbed(posibleGhosts, evidences);
  }

  // TODO: Should this be in its own class
  private async getMissingEvidenceFor(ghosts: GhostType[], knownEvidences: string[]): Promise<{ [key: string] : Evidence[] }> {
    let promises: { [key: string] : Promise<Evidence[]> } = {};

    for(let ghostType of ghosts) {
      let promise = Evidences.givenBy(ghostType);
      promises[ghostType.name] = promise;
    }

    let missingEvidence : { [key: string] : Evidence[] } = {};
    for(let ghostType of ghosts ) {
      let evidences = (await promises[ghostType.name]).filter( evidence => knownEvidences.indexOf(evidence.short_name) < 0 );
      missingEvidence[ghostType.name] = evidences;
    }

    return missingEvidence;
  }

  private renderSimpleListEmbed(ghosts: GhostType[], evidences: { [key: string] : Evidence[] }): MessageEmbed {
    let message = new MessageEmbed().setColor('#666666')
      .setTitle('Bueh, una pista nomás?... Aca tenes una lista de lo que podria ser :rolling_eyes:')
      .addFields([
        { name: "Ghost", value:'\u200b', inline: true},
        { name: "Missing Evidence 0", value:'\u200b', inline: true},
        { name: "Missing Evidence 1", value:'\u200b', inline: true},
      ]);

    ghosts.forEach((ghost, index) => {
      const data = this.getFormatedMissingEvidence(ghost, evidences[ghost.name], index);

      message.addFields([
        { name: '\u200b', value: data.ghostName, inline: true},
        { name: '\u200b', value: data.evidence[0], inline: true},
        { name: '\u200b', value: data.evidence[1], inline: true},
      ]);
    });

    return message;
  }

  private renderAdvidceMessage(ghosts: GhostType[], evidences: { [key: string] : Evidence[] }): MessageEmbed {
    let message = new MessageEmbed().setColor('#666666')
      .setTitle('Posibles ghosts')
      .setDescription('Given the clues you gave me, the ghost can be one of the following:')

    ghosts.forEach((ghost) => {

      let formattedEvidence = evidences[ghost.name].map((evidence) => new StringFormatter(evidence.name).wordUpper().text);
      if(formattedEvidence.length === 0) formattedEvidence=["None"];

      message.addFields([
        { name: ghost.name.toUpperCase(), value: ghost.advice},
        { name: 'Missing Evidence', value: formattedEvidence, inline: true},
      ]);
    });

    return message;
  }

  private getFormatedMissingEvidence(ghost: GhostType, evidences: Evidence[], index: number) {
    let ghostName =  new StringFormatter(ghost.name).wordUpper().italic().bold(index % 2 == 1).text;
    let capitalizedEvidence = evidences.map((evidence) => new StringFormatter(evidence.name).wordUpper().italic().bold(index % 2 == 1).text);
    return { 'ghostName': ghostName, 'evidence': capitalizedEvidence }
  }

}
