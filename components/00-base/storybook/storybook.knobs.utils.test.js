import { boolean, color, date as dateKnob, number, optionsKnob, radios, select, text } from '@storybook/addon-knobs';
import { knobBoolean, knobColor, knobDate, knobNumber, knobOptions, knobRadios, knobSelect, knobText, KnobValue, KnobValues, processKnob, shouldRender, slotKnobs } from './storybook.knobs.utils';

jest.mock('@storybook/addon-knobs', () => ({
  boolean: jest.fn(),
  color: jest.fn(),
  date: jest.fn(),
  number: jest.fn(),
  optionsKnob: jest.fn(),
  radios: jest.fn(),
  select: jest.fn(),
  text: jest.fn(),
}));

describe('KnobValue', () => {
  it('should initialize with correct default values', () => {
    const knobValue = new KnobValue();
    expect(knobValue.getValue()).toBe(null);
    expect(knobValue.isUsingDefault()).toBe(false);
  });

  it('should initialize with provided values', () => {
    const knobValue = new KnobValue('test', true);
    expect(knobValue.getValue()).toBe('test');
    expect(knobValue.isUsingDefault()).toBe(true);
  });
});

describe('KnobValues', () => {
  it('should return default knob values if not provided', () => {
    const knobValues = new KnobValues();
    expect(knobValues.nonExistentProp).toEqual(new KnobValue(null, true));
  });

  it('should return provided knob values', () => {
    const knobValues = new KnobValues({ testProp: 'testValue' });
    expect(knobValues.testProp).toBe('testValue');
  });

  it('should return parent knob values if provided', () => {
    const parentKnobs = { parentProp: 'parentValue' };
    const knobValues = new KnobValues({}, true, parentKnobs);
    expect(knobValues.parentProp).toBe('parentValue');
  });
});

describe('processKnob', () => {
  it('should return default value and render knob if parent is undefined', () => {
    const callback = jest.fn();
    processKnob('test', 'default', undefined, 'General', callback);
    expect(callback).toHaveBeenCalledWith('test', 'default', 'General');
  });

  it('should return parent value if parent is not a KnobValue instance', () => {
    expect(processKnob('test', 'default', 'parentValue', 'General', jest.fn()))
      .toBe('parentValue');
  });

  it('should return default value if KnobValue is using default', () => {
    const knobValue = new KnobValue(null, true);
    expect(processKnob('test', 'default', knobValue, 'General', jest.fn()))
      .toBe('default');
  });

  it('should return knob value if KnobValue has a null value', () => {
    const callback = jest.fn();
    const knobValue = new KnobValue(null, false);
    processKnob('test', 'default', knobValue, 'General', callback);
    expect(callback).toHaveBeenCalledWith('test', 'default', 'General');
  });

  it('should return KnobValue value if it is set', () => {
    const callback = jest.fn();
    const knobValue = new KnobValue('knobValue', false);
    processKnob('test', 'default', knobValue, 'General', callback);
    expect(callback).toHaveBeenCalledWith('test', 'knobValue', 'General');
  });
});

describe('Knob Wrappers', () => {
  it('knobText should process knob correctly', () => {
    const parent = new KnobValue('parentValue', false);
    knobText('test', 'default', parent, 'General');
    expect(text).toHaveBeenCalledWith('test', 'parentValue', 'General');
  });

  it('knobRadios should process knob correctly', () => {
    const parent = new KnobValue('parentValue', false);
    knobRadios('test', { option1: 'Option 1' }, 'default', parent, 'General');
    expect(radios)
      .toHaveBeenCalledWith('test', { option1: 'Option 1' }, 'parentValue', 'General');
  });

  it('knobBoolean should process knob correctly', () => {
    const parent = new KnobValue(true, false);
    knobBoolean('test', false, parent, 'General');
    expect(boolean).toHaveBeenCalledWith('test', true, 'General');
  });

  it('knobNumber should process knob correctly', () => {
    const parent = new KnobValue(42, false);
    knobNumber('test', 0, {}, parent, 'General');
    expect(number).toHaveBeenCalledWith('test', 42, {}, 'General');
  });

  it('knobSelect should process knob correctly', () => {
    const parent = new KnobValue('parentValue', false);
    knobSelect('test', { option1: 'Option 1' }, 'default', parent, 'General');
    expect(select)
      .toHaveBeenCalledWith('test', { option1: 'Option 1' }, 'parentValue', 'General');
  });

  it('knobColor should process knob correctly', () => {
    const parent = new KnobValue('#ffffff', false);
    knobColor('test', '#000000', parent, 'General');
    expect(color).toHaveBeenCalledWith('test', '#ffffff', 'General');
  });

  it('knobOptions should process knob correctly', () => {
    const parent = new KnobValue('parentValue', false);
    knobOptions('test', { option1: 'Option 1' }, 'default', {}, parent, 'General');
    expect(optionsKnob)
      .toHaveBeenCalledWith('test', { option1: 'Option 1' }, 'parentValue', {}, 'General');
  });

  it('knobDate should process knob correctly', () => {
    const parent = new KnobValue(new Date(), false);
    knobDate('test', new Date(), parent, 'General');
    expect(dateKnob).toHaveBeenCalledWith('test', parent.getValue(), 'General');
  });
});

describe('shouldRender', () => {
  it('should return true if parentKnobs is null or not an object', () => {
    expect(shouldRender(null)).toBe(true);
    expect(shouldRender('not an object')).toBe(true);
  });

  it('should return true if parentKnobs is an empty object', () => {
    expect(shouldRender({})).toBe(true);
  });

  it('should return the shouldRender flag if parentKnobs is an instance of KnobValues', () => {
    const knobValues = new KnobValues({}, false);
    expect(shouldRender(knobValues)).toBe(false);
  });

  it('should return false if any KnobValue has a non-null value or is not using default', () => {
    const parentKnobs = {
      prop1: new KnobValue('value', false),
      prop2: new KnobValue(null, false),
    };
    expect(shouldRender(parentKnobs)).toBe(false);
  });

  it('should return true if all KnobValues are null and using default', () => {
    const parentKnobs = {
      prop1: new KnobValue(null, true),
      prop2: new KnobValue(null, true),
    };
    expect(shouldRender(parentKnobs)).toBe(true);
  });
});

describe('slotKnobs', () => {
  beforeEach(() => {
    boolean.mockClear();
    boolean.mockImplementation(() => true); // Mock implementation to return true
  });

  it('should return slot knobs with provided names', () => {
    const names = ['slot1', 'slot2'];
    const result = slotKnobs(names);
    expect(result).toEqual({
      slot1: '<div class="story-slot story-slot--slot1"><code>{{ slot1 }}</code></div>',
      slot2: '<div class="story-slot story-slot--slot2"><code>{{ slot2 }}</code></div>',
    });
  });

  it('should return an empty object if showSlots is false', () => {
    boolean.mockImplementation(() => false);
    const names = ['slot1', 'slot2'];
    const result = slotKnobs(names);
    expect(result).toEqual({});
  });
});

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
        expect(processKnob(name, defaultValue, parent, group, cb))
          .toStrictEqual(expected);
      } else {
        expect(processKnob(name, defaultValue, parent, group, cb))
          .toBe(expected);
      }
    });
  },
);
