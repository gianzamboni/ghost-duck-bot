import { GuildMember, Message, TextChannel, VoiceChannel } from "discord.js";

import { BotCommand } from "@abstracts/bot-command";
import { PermissionManager } from "@services/permission-manager";
import { VoiceConnectionManager } from "@services/voice-connection-manager";

export interface EstaArgs {
  message: string;
  channel: TextChannel;
}

export class EstaCommand implements BotCommand {

  constructor() { }

  get description(): string {
    return 'Reproduzco una parte de Quieréme de Jean Carlo y te mando un gif de Últimos Cartuchos';
  }

  async reply(message: Message, args: string[] | undefined) : Promise<void> {
    let user = message.member as GuildMember;

    let errorMessage = PermissionManager.canPlayAudio(user);
    if(errorMessage) {
      message.reply(errorMessage);
      return;
    }

    let channel = user.voice.channel as VoiceChannel;
    let soundFilename = this.getSong(args);

    VoiceConnectionManager.join(channel).play(soundFilename);
    message.channel.send({
      files: ['static/gifs/esta.gif']
     });
  }

  private getSong(args: string[] | undefined): string {
    if(!args) return 'static/esta/esta.mp3';

    switch(args[0]) {
      case 'full':
        return 'static/esta/esta-full.mp3';

      case 'fast':
        return 'static/esta/esta-fast.mp3';

      default:
        return 'static/esta/esta.mp3';
    }
  }
}