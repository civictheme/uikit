import { randomArrayItem, randomBool, randomFutureDate, randomId, randomInt, randomLinks, randomName, randomSentence, randomString, randomTags, randomText, randomUrl } from './storybook.random.utils';

describe('Random Generators', () => {
  test.each([
    [0.1, expect.any(Boolean)],
    [0.9, expect.any(Boolean)],
    [undefined, expect.any(Boolean)],
  ])('randomBool(%s) returns %s', (skew, expected) => {
    expect(randomBool(skew)).toEqual(expected);
  });

  test.each([
    [1, 100, expect.any(Number)],
    [10, 20, expect.any(Number)],
    [undefined, undefined, expect.any(Number)],
  ])('randomInt(%s, %s) returns %s', (min, max, expected) => {
    expect(randomInt(min, max)).toEqual(expected);
  });

  test.each([
    ['', expect.stringContaining('random-id-')],
    ['prefix', expect.stringContaining('random-id-prefix-')],
  ])('randomId(%s) returns %s', (prefix, expected) => {
    expect(randomId(prefix)).toEqual(expected);
  });

  test.each([
    [['a', 'b', 'c'], expect.any(String)],
    [[1, 2, 3], expect.any(Number)],
    [[], undefined],
  ])('randomArrayItem(%s) returns %s', (array, expected) => {
    expect(randomArrayItem(array)).toEqual(expected);
  });

  test.each([
    [5, null, expect.any(String)],
    [10, 'seed', expect.any(String)],
  ])('randomText(%s, %s) returns %s', (words, seed, expected) => {
    expect(randomText(words, seed)).toEqual(expected);
  });

  test.each([
    [5, null, expect.any(String)],
    [10, 'seed', expect.any(String)],
  ])('randomString(%s, %s) returns %s', (length, seed, expected) => {
    expect(randomString(length, seed)).toEqual(expected);
  });

  test.each([
    [8, null, expect.any(String)],
    [12, 'seed', expect.any(String)],
  ])('randomName(%s, %s) returns %s', (length, seed, expected) => {
    expect(randomName(length, seed)).toEqual(expected);
  });

  test.each([
    [5, null, expect.any(String)],
    [10, 'seed', expect.any(String)],
  ])('randomSentence(%s, %s) returns %s', (words, seed, expected) => {
    expect(randomSentence(words, seed)).toEqual(expected);
  });

  test.each([
    [undefined, expect.stringContaining('http://')],
    ['http://custom.com', expect.stringContaining('http://custom.com/')],
  ])('randomUrl(%s) returns %s', (domain, expected) => {
    expect(randomUrl(domain)).toEqual(expected);
  });

  xtest('randomFutureDate() returns a future date string', () => {
    const result = randomFutureDate();
    expect(new Date(result).getTime()).toBeGreaterThan(new Date().getTime());
  });

  test.each([
    [3, 5, 'http://example.com', 'Prefix', expect.any(Array)],
    [2, 0, 'http://test.com', 'Test', expect.any(Array)],
  ])('randomLinks(%s, %s, %s, %s) returns %s', (count, length, domain, prefix, expected) => {
    expect(randomLinks(count, length, domain, prefix)).toEqual(expected);
  });

  test.each([
    [3, false, expect.any(Array)],
    [5, true, expect.any(Array)],
  ])('randomTags(%s, %s) returns %s', (count, rand, expected) => {
    expect(randomTags(count, rand)).toEqual(expected);
  });
});
