import { Message, VoiceChannel } from "discord.js";
import { joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	entersState,
	StreamType,
	AudioPlayerStatus,
	VoiceConnectionStatus
} from '@discordjs/voice';

import { ConnectionManager } from './connection-manager';
import { BotCommand } from "@abstracts/bot-command";

export class SoundCommand extends BotCommand {

  private bannedUsers: { [key: string]: boolean };
  protected filename: string;

  constructor(name: string, filename: string) {
    super(name);

    this.filename = filename;
    this.bannedUsers = {};
  }

  async exec(message: Message) : Promise<void> {
    if(!message.member?.voice.channel) {
      message.channel.send("Deja de trolear, forro. Necesitas estar conectado al canal de voz para usarme");
    } else if (this.bannedUsers[message.author.id]) {
      message.channel.send("Ya se que el comando es lo mejor que hay, pero dejá de espamearlo cap@");
    } else {
      this.banUser(message.author.id);
      this.playSoundOn(message.member.voice.channel as VoiceChannel);
    }
  }

  private banUser(user: string) {
    this.bannedUsers[user] = true;
      setTimeout(() => {
        this.bannedUsers[user] = false;
      }, 10000);

  }

  protected async playSoundOn(channel: VoiceChannel) {
    const connection = await joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: ConnectionManager.create(channel)
    });

    await entersState(connection, VoiceConnectionStatus.Ready, 30e3);

    const player = createAudioPlayer();

    await connection.subscribe(player);

    const resource = createAudioResource(this.filename, {
      inputType: StreamType.Arbitrary
    });

    player.play(resource);
    await entersState(player, AudioPlayerStatus.Playing, 5e3);

  }

};