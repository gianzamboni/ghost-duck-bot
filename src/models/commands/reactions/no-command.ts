import { Message } from "discord.js";

import { BotCommand } from "../../../abstracts/bot-command";

export class NoCommand extends BotCommand {

  constructor() {
    super("no.");
  }

  shouldExec(message: Message): boolean {
    let matches = message.content.match(/^.*no\..*$/i);
    return  matches !== null;
  }

  exec(message: Message): void {
      message.channel.send("https://media0.giphy.com/media/W2zOnQonnYsNXnUxXo/giphy.gif");
  }
};