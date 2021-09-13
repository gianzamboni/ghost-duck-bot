import { readdirSync } from 'fs';
import { Collection, GuildMember, Message, VoiceChannel} from "discord.js";

import { BotLogger } from '@helpers/bot-logger';
import { VoiceConnectionManager } from '@services/voice-connection-manager';
import { PermissionManager } from '@services/permission-manager';
export class SoundManager {

  private _sounds : Collection<string, string>;

  constructor() {
    this._sounds = new Collection<string, string>();
    this.setSounds();
  }

  public async reply(message : Message): Promise<void> {
    BotLogger.log.info(`Sound "${message.content}" requested from ${message.guild?.name}`);

    let sound: string = message.content;
    let user =  message.member as GuildMember;
    let channel = message.member?.voice.channel as VoiceChannel;

    if (!this._sounds.has(sound)) {
      BotLogger.log.info(`Sound "${message.content}" does not exist`);
      message.reply('No tengo ese sonido, andá a buscarlo a otro lado');
      return;
    }

    let permissionErrorMessage = PermissionManager.canPlayAudio(user);
    if (permissionErrorMessage) {
      message.reply(permissionErrorMessage);
      return;
    }

    PermissionManager.banUser(user);

    let soundFilename = this._sounds.get(sound) as string;
    VoiceConnectionManager.join(channel).play(soundFilename);
  }

  public get sounds(): string[] {
    return Array.from(this._sounds.keys());
  }

  private setSounds(): void {
    let soundFiles = readdirSync(`static/mp3/`);
    for(let filename of soundFiles) {
      let name = filename.split('.')[0];
      this._sounds.set(name, `${__dirname}/../static/mp3/${filename}`);
    }
  };
}