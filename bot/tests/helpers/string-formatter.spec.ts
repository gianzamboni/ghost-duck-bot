import { StringFormatter } from '@models/helpers/string-formatter';

describe('StringFormatter', () => {
  let formatter: StringFormatter;
  let example: string = 'a sentence';

  beforeEach(()=> {
    formatter = new StringFormatter(example);
  })

  test('it should return example as is if formatting is not done',() =>{
    expect(formatter.text).toBe('a sentence')
  })

  describe('bold', () => {
      test('it should add bold wrapping to text', () => {
        expect(formatter.bold().text).toBe(`**a sentence**`);
      });

      test('it should not add bold wrapping to text if false is passed as argument', () => {
        expect(formatter.bold(false).text).toBe(`a sentence`);
      });
    })

    describe('italic', () => {
      test('it should italize text', () => {
        expect(formatter.italic().text).toBe(`*a sentence*`);
      });

      test('it should not italize text if false is passed as argument', () => {
        expect(formatter.italic(false).text).toBe(`a sentence`);
      });
    })

    describe('strikethrough', () => {
      test('it should strike text', () => {
        expect(formatter.strikethrough().text).toBe(`~~a sentence~~`);
      });

      test('it should not strike text if false is passed as argument', () => {
        expect(formatter.strikethrough(false).text).toBe(`a sentence`);
      });
    })

    describe('wordUpper', () => {
      test('it should capatalize the first letter of each wordt', () => {
        expect(formatter.wordUpper().text).toBe(`A Sentence`);
      });

      test('it should not capitalize text if false is passed as argument', () => {
        expect(formatter.wordUpper(false).text).toBe(`a sentence`);
      });
    })
});