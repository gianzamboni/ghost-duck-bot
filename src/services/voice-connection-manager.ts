import { DiscordGatewayAdapterCreator, entersState, joinVoiceChannel, VoiceConnection, VoiceConnectionDisconnectReason, VoiceConnectionStatus } from "@discordjs/voice";
import { Collection, Snowflake, VoiceChannel } from "discord.js";
import { promisify } from "util";

import { BotLogger } from '@helpers/bot-logger';
import { SoundPlayer } from '@resources/sound-player';


let wait = promisify(setTimeout);

export class VoiceConnectionManager {

  private static _connections = new Collection<Snowflake, VoiceConnection>();
  private static _players = new Collection<Snowflake, SoundPlayer>();

  private constructor() {};

  public static join(channel: VoiceChannel): SoundPlayer {
    if(!this._connections.has(channel.guildId)) {
      let newConnection = this.createConnectionFor(channel);
      let newPlayer = this.createSoundPlayerFor(newConnection);

      this._connections.set(channel.guildId, newConnection);
      this._players.set(channel.guildId, newPlayer);
    };

    return this._players.get(channel.guildId) as SoundPlayer;
  }

  private static createConnectionFor(channel: VoiceChannel) {
    let newConnection: VoiceConnection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
    });

    BotLogger.log.info(`Joined to voice channel "${channel.name}"`);

    newConnection.on('error', (error) => {
      BotLogger.log.error(error);
    })

    newConnection.on(VoiceConnectionStatus.Disconnected, async ( _, newState) => {
      BotLogger.log.info(`Disconnected from "${channel.name}"`);
      if (newState.reason === VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
        try {
          await entersState(newConnection, VoiceConnectionStatus.Connecting, 5_000);
        } catch {
          BotLogger.log.info(`Failed to reconnect to "${channel.name}"`);
          newConnection.destroy();
        }
      } else if (newConnection.rejoinAttempts < 5) {
        await wait((newConnection.rejoinAttempts + 1) * 5_000);
        newConnection.rejoin();
      } else {
        BotLogger.log.info(`Failed to reconnect to "${channel.name}"`);
        newConnection.destroy();
      }
    });

    newConnection.on(VoiceConnectionStatus.Destroyed, async () => {
      BotLogger.log.info(`Connetion to "${channel.name}" destroyed`);
    });

    return newConnection;
  }

  private static createSoundPlayerFor(connection: VoiceConnection): SoundPlayer {

    let newPlayer = new SoundPlayer(connection);

    newPlayer.on('destroyed', () => {
      this.clearPlayer(connection.joinConfig.guildId);
    });

    return newPlayer;

  }

  private static clearPlayer(channelId: Snowflake) {
    let connection = this._connections.get(channelId);
    this._players.get(channelId);

    if(connection) {
      if(connection.state.status != VoiceConnectionStatus.Destroyed) connection.destroy();
      this._connections.delete(channelId);
    }

    this._players.delete(channelId);

    BotLogger.log.info(`Connection to channel ${channelId} cleared`);
  };
}