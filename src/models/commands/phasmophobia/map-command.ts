import { Message } from 'discord.js';

import { BotCommand } from "@abstracts/bot-command";
import { Map } from "@interfaces/map";
import { Maps } from "@models/db-entities/maps";

export class MapCommand extends BotCommand {

  constructor() {
    super("rmap")
    this.description.addLines([
      `If you can't decide which map to play, I will choose it for you`,
      "This are the maps I know:"
    ]);
    this.addMapsToDescription();

  }

  async addMapsToDescription(): Promise<void> {
      let maps = await Maps.all({
        attr: ['name']
      });
      
      this.description.addList(maps.map((map: Map) => map.name));
  }

  shouldExec(message: Message): boolean {
    return message.content === this.name;
  }

  async exec(message: Message): Promise<void> {
    let randomMap: Map = await Maps.getRandom();
    message.channel.send(randomMap.gif_link);
  }

};