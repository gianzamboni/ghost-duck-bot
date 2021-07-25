import { Message, VoiceChannel } from "discord.js";

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
      this.playSoundOn(message.member.voice.channel);
    }
  }

  private banUser(user: string) {
    this.bannedUsers[user] = true;
      setTimeout(() => {
        this.bannedUsers[user] = false;
      }, 10000);

  }

  protected async playSoundOn(channel: VoiceChannel) {
    const connection = await channel.join();
    const dispacther = connection.play(this.filename);
    dispacther.on('finish', () => {
      connection.disconnect();
    });
  }

};