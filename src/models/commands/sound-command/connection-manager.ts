import { DiscordGatewayAdapterLibraryMethods } from '@discordjs/voice';
import { VoiceChannel, Snowflake, Client, Constants, Guild } from 'discord.js';
import { GatewayVoiceServerUpdateDispatchData, GatewayVoiceStateUpdateDispatchData } from 'discord-api-types/v9';

export class ConnectionManager {

  private static adapters = new Map<Snowflake, DiscordGatewayAdapterLibraryMethods>();
  private static trackedClients = new Set<Client>();
  private static trackedShards = new Map<number, Set<Snowflake>>();

  public static create(channel: VoiceChannel) {
    return (methods: DiscordGatewayAdapterLibraryMethods) => {
      this.adapters.set(channel.guild.id, methods);
      this.trackClient(channel.client);
      this.trackGuild(channel.guild);

      let factory = this;
      return {
        sendPayload(data: GatewayVoiceServerUpdateDispatchData) {
          if (channel.guild.shard.status === Constants.Status.READY) {
            channel.guild.shard.send(data);
            return true;
          }
          return false;
        },

        destroy() {
          return factory.adapters.delete(channel.guild.id);
        },
      };
    };
  }

  private static trackClient(client: Client) {
    if (this.trackedClients.has(client)) return;
    this.trackedClients.add(client);

    client.ws.on(Constants.WSEvents.VOICE_SERVER_UPDATE, (payload: GatewayVoiceServerUpdateDispatchData) => {
      this.adapters.get(payload.guild_id)?.onVoiceServerUpdate(payload);
    });

    client.ws.on(Constants.WSEvents.VOICE_STATE_UPDATE, (payload: GatewayVoiceStateUpdateDispatchData) => {
      if (payload.guild_id && payload.session_id && payload.user_id === client.user?.id) {
        this.adapters.get(payload.guild_id)?.onVoiceStateUpdate(payload);
      }
    });

    client.on(Constants.Events.SHARD_DISCONNECT, (_, shardID) => {
      const guilds = this.trackedShards.get(shardID);
      if (guilds) {
        for (const guildID of guilds.values()) {
          this.adapters.get(guildID)?.destroy();
        }
      }

      this.trackedShards.delete(shardID);
    });
  }

  private static trackGuild(guild: Guild) {
    let guilds = this.trackedShards.get(guild.shard.id);
    if (!guilds) {
      guilds = new Set();
      this.trackedShards.set(guild.shard.id, guilds);
    }
    guilds.add(guild.id);
  }

}