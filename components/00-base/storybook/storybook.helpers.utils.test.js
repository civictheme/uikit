import { arrayCombine, objectFromArray, capitalizeFirstLetter, cleanCssIdentifier, toLabels, dateIsValid, convertDate } from './storybook.helpers.utils';

describe('Helper Utilities', () => {
  describe('arrayCombine', () => {
    test.each([
      [['a', 'b'], [1, 2], { a: 1, b: 2 }],
      [['key1', 'key2'], ['value1', 'value2'], { key1: 'value1', key2: 'value2' }],
      [['key'], ['value'], { key: 'value' }],
    ])('combines arrays %s and %s into %s', (keys, values, expected) => {
      expect(arrayCombine(keys, values)).toEqual(expected);
    });

    test.each([
      [['a'], null, false],
      [null, [1], false],
      [['a'], [1, 2], false],
      [['a', 'b'], [1], false],
    ])('returns false for invalid inputs %s and %s', (keys, values, expected) => {
      expect(arrayCombine(keys, values)).toBe(expected);
    });
  });

  describe('objectFromArray', () => {
    test.each([
      [['a', 'b', 'c'], { a: 'a', b: 'b', c: 'c' }],
      [['key1', 'key2'], { key1: 'key1', key2: 'key2' }],
      [[], {}],
    ])('creates object from array %s as %s', (array, expected) => {
      expect(objectFromArray(array)).toEqual(expected);
    });
  });

  describe('capitalizeFirstLetter', () => {
    test.each([
      ['hello', 'Hello'],
      ['world', 'World'],
      ['a', 'A'],
      ['', ''],
    ])('capitalizes the first letter of %s to %s', (input, expected) => {
      expect(capitalizeFirstLetter(input)).toBe(expected);
    });
  });

  describe('cleanCssIdentifier', () => {
    test.each([
      ['example identifier', 'example-identifier'],
      ['Hello World!', 'hello-world'],
      ['CSS_Identifier', 'css-identifier'],
      ['CSS&Identifier', 'cssidentifier'],
    ])('cleans the CSS identifier %s to %s', (input, expected) => {
      expect(cleanCssIdentifier(input)).toBe(expected);
    });
  });

  describe('toLabels', () => {
    test.each([
      [['example_identifier', 'another_example'], ['Example identifier', 'Another example']],
      [['hello-world', 'test_label'], ['Hello world', 'Test label']],
    ])('converts %s to labels %s', (values, expected) => {
      expect(toLabels(values)).toEqual(expected);
    });
  });

  describe('dateIsValid', () => {
    test.each([
      ['2021-12-31', true],
      ['31/12/2021', false],
      ['invalid-date', false],
      [null, false],
      ['', false],
    ])('checks if %s is a valid date: %s', (date, expected) => {
      expect(dateIsValid(date)).toBe(expected);
    });
  });

  describe('convertDate', () => {
    test.each([
      ['2021-12-31', '31 Dec 2021'],
      ['2020-01-01', '1 Jan 2020'],
    ])('converts date %s to %s', (date, expected) => {
      expect(convertDate(date)).toBe(expected);
    });
  });
});
