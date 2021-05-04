import { Message } from "discord.js";

import { BotCommand } from "./../../../abstracts/bot-command";

export class OwoCommand extends BotCommand {

  constructor() {
    super("owo");
  }

  shouldExec(message: Message): boolean {
    let matches = message.content.match( /^.*o+[ ]*w+[ ]*o+.*$/i);
    return  matches !== null;
  }

  exec(message: Message): void {
      message.channel.send("https://media1.tenor.com/images/f5bc4d03d3c78d585508945daead8a7e/tenor.gif");
  }
};