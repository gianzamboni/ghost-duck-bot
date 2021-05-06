export class StringFormatter {

  public static readonly stylizers: { [id: string ]: (s: string) => string; } = {
    'bold': (sentence:  string) => `**${sentence}**`,
    'capitalize': (sentence:  string) => sentence.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()),
    'italic': (sentence:  string) => `*${sentence}*`,
    'strikethrough': (sentence:  string) => `~~${sentence}~~`
  }

  private constructor() {};

  public static format(sentence: string, styles: string[]): string {
    return styles.reduce((current, style) => {
      return this.stylizers[style](current)
    }, sentence);
  }
  
}