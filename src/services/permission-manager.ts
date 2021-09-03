import { GuildMember, Snowflake, VoiceChannel } from "discord.js";

import { BotLogger } from "@helpers/bot-logger";

export class PermissionManager {

  private static _bannedUsers: Set<Snowflake> = new Set<Snowflake>();

  private constructor() {  };

  public static canPlayAudio(user: GuildMember): string | false {
    let channel = user.voice.channel;
    if(!(channel instanceof VoiceChannel)) {
      BotLogger.log.info(`User "${user.nickname}" is not connected to a voice channel`);
      return 'Deja de trolear, forr@. Necesitas estar conectado a algún canal de voz para usarme';
    }

    if(this._bannedUsers.has(user.id)) {
      BotLogger.log.info(`User "${user.nickname}" is marked as banned from using sound commands`);
      return 'Ya se que el comando es lo mejor que hay, pero dejá de espamearlo cap@';
    }

    return false;
  }

  public static banUser(user: GuildMember): void {
    this._bannedUsers.add(user.id);
    setTimeout(() => {
      this._bannedUsers.delete(user.id)
      BotLogger.log.info(`User "${user.nickname}" can use sound commands again`);
    } , 10000);

    BotLogger.log.info(`User "${user.nickname}" cannot use sound commands for 10 seconds`);
  }
}