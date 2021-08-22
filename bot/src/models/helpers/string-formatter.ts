export class StringFormatter {

  private _text: string;

  constructor(aString: string) {
    this._text = aString;
  };

  get text() : string {
    return this._text;
  }

  public bold(mustApply: boolean = true): StringFormatter {
    if(mustApply) this._text = `**${this._text}**`;
    return this;
  }

  public italic(mustApply: boolean = true): StringFormatter {
    if(mustApply) this._text = `*${this._text}*`;
    return this;
  }

  public strikethrough(mustApply: boolean = true): StringFormatter {
    if(mustApply) this._text = `~~${this._text}~~`;
    return this;
  }

  public wordUpper(mustApply: boolean = true): StringFormatter {
    if(mustApply) this._text = this._text.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
    return this;
  }
}