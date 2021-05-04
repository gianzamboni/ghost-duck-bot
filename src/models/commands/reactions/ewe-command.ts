import { Message } from "discord.js";

import { BotCommand } from "./../../../abstracts/bot-command";

export class EweCommand extends BotCommand {

  constructor()   {
    super("ewe", [])
  }

  shouldExec(message: Message): boolean {
    let matches = message.content.match(/^.*e+[ ]*w+[ ]*e+.*$/i);
    return  matches !== null
  }

  exec(message: Message) : void {
    message.channel.send("https://media1.tenor.com/images/fccd309c70e59df9fe27bd81b6429eb1/tenor.gif?itemid=12689104");
  }

};