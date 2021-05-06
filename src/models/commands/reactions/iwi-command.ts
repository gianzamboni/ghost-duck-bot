import { Message } from "discord.js";

import { BotCommand } from "@abstracts/bot-command";

export class IwiCommand extends BotCommand {

  constructor()   {
    super("iwi")
  }

  shouldExec(message: Message): boolean {
    let matches = message.content.match(/^.*i+[ ]*w+[ ]*i+.*$/i);
    return  matches !== null
  }

  exec(message: Message) : void {
    message.channel.send("https://media1.tenor.com/images/25934fdaaed5854e775526931b900cab/tenor.gif");
  }

};