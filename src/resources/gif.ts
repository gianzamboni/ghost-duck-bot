export class Gif {
  private readonly _regex: RegExp;
  private readonly _filename: string;

  constructor(regex: RegExp, filename: string) {
    this._regex = regex;
    this._filename = filename;
  }

  public shouldReplyTo(message: string): boolean {
    return this._regex.test(message);
  }

  get file(): string {
    return this._filename;
  }
}