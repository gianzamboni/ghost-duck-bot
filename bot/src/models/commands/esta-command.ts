import { CommandDescription } from "@models/command-description";
import { Message } from "discord.js";
import { SoundCommand } from "./sound-command";

// Convert to a mixed media command (Extend from MixedMediaCommand)
export class EstaCommand extends SoundCommand {

  constructor()   {
    super("esta", 'static/mp3/esta/esta.mp3');

    this.parameters = ["full | fast"]
  }

  public getDescription() : CommandDescription {
    let description = new CommandDescription();
    description.addLine('Reproduce una parte de Quiereme de Jean Carlo');
    return description;
  }

  public async exec(message: Message) : Promise<void> {
    this.getSong(message);
    super.exec(message);
    message.channel.send({
      files: ['static/gifs/esta.gif']
     });
  }

  private getSong(message: Message): void {
    let params: string[] = message.content.split(" ");
    params.shift();

    switch(params[0]) {
      case "full":
        this.filename = 'static/mp3/esta/esta-full.mp3';
        break;
      case "fast":
        this.filename = 'static/mp3/esta/esta-fast.mp3';
        break;
      default:
        this.filename = 'static/mp3/esta/esta.mp3';
        break;
    }
  }

};