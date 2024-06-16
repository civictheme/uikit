import { KnobValue, processKnob } from './storybook.knobs.utils';

// eslint-disable-next-line no-unused-vars
const knobCallback = jest.fn((name, value, group) => value);

const dataProviderProcessKnob = () => [
  ['name', 'default', undefined, 'group', knobCallback, 'default'],
  ['name', 'default', null, 'group', knobCallback, null],
  ['name', 'default', false, 'group', knobCallback, false],
  ['name', 'default', true, 'group', knobCallback, true],

  ['name', 'default', 'direct value', 'group', knobCallback, 'direct value'],
  ['name', 'default', { a: 'b' }, 'group', knobCallback, { a: 'b' }],

  ['name', 'default', new KnobValue(null), 'group', knobCallback, 'default'],
  ['name', 'default', new KnobValue(null, true), 'group', knobCallback, 'default'],
  ['name', 'default', new KnobValue(null, false), 'group', knobCallback, 'default'],

  ['name', 'default', new KnobValue('value'), 'group', knobCallback, 'value'],
  ['name', 'default', new KnobValue('value', true), 'group', knobCallback, 'default'],
  ['name', 'default', new KnobValue('value', false), 'group', knobCallback, 'value'],
];

describe.each(dataProviderProcessKnob())(
  'processKnob(%s, %s, %p, %s, knobCallback)',
  (name, defaultValue, parent, group, cb, expected) => {
    test(`returns ${expected}`, () => {
      if (typeof expected === 'object') {
        expect(processKnob(name, defaultValue, parent, group, cb)).toStrictEqual(expected);
      } else {
        expect(processKnob(name, defaultValue, parent, group, cb)).toBe(expected);
      }
    });
  },
);
