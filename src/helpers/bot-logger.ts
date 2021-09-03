
import { Logger, transports, format, createLogger } from "winston";
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, printf } = format;

export class BotLogger {

  public static log : Logger;

  public static init() {
    if(this.log) return;

    let logFormat = printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level}] ${message}`;
    });
    this.log = createLogger({
      format: combine(
        timestamp(),
        logFormat
      ),
      level: 'debug',
      transports: [
        new transports.Stream({
          stream: process.stderr,
        }),
        new DailyRotateFile({
          filename: 'ghost-duck.%DATE%.log',
          dirname: '`${__dirname}/../static/logs',
          maxSize: '500k',
          maxFiles: 100
        })
      ]
    })
  }
}