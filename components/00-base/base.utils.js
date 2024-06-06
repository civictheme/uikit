//
// Centralised utilities for all Storybook stories.
//
/* eslint max-classes-per-file: 0 */

import { boolean, color, date as dateKnob, number, optionsKnob, radios, select, text } from '@storybook/addon-knobs';
import { LoremIpsum } from 'lorem-ipsum';
import CivicThemeInput from '../01-atoms/input/input.twig';
import CivicThemeSelect from '../01-atoms/select/select.twig';
import CivicThemeCheckbox from '../01-atoms/checkbox/checkbox.twig';
import CivicThemeRadio from '../01-atoms/radio/radio.twig';
import CivicThemeField from '../02-molecules/field/field.twig';
import CivicThemeLabel from '../01-atoms/label/label.twig';

// =============================================================================
// UTILITIES
// =============================================================================

export const arrayCombine = function (keys, values) {
  const obj = {};

  if (!keys || !values || keys.constructor !== Array || values.constructor !== Array) {
    return false;
  }

  if (keys.length !== values.length) {
    return false;
  }

  for (let i = 0; i < keys.length; i++) {
    obj[keys[i]] = values[i];
  }

  return obj;
};

export const objectFromArray = (array) => {
  const obj = {};
  array.forEach((item) => {
    obj[item] = item;
  });
  return obj;
};

export const capitalizeFirstLetter = (string) => string.charAt(0)
  .toUpperCase() + string.slice(1);

export const indexedString = 'PlaceholderText';

export const cleanCssIdentifier = function (string) {
  return string.toLowerCase()
    .replace(/(&\w+?;)/gim, ' ')
    .replace(/[_.~"<>%|'!*();:@&=+$,/?%#[\]{}\n`^\\]/gim, '')
    .replace(/(^\s+)|(\s+$)/gim, '')
    .replace(/\s+/gm, '-');
};

export const toLabels = function (values) {
  const arr = [];
  for (const i in values) {
    arr.push(capitalizeFirstLetter(values[i].replace(/[-_]/, ' ')));
  }
  return arr;
};

export const getThemes = () => ({
  light: 'Light',
  dark: 'Dark',
});

export const dateIsValid = function (date) {
  return !Number.isNaN(Date.parse(date));
};

export const convertDate = (date) => new Date(date).toLocaleDateString('en-uk', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

// =============================================================================
// RANDOM GENERATORS
// =============================================================================

export const randomBool = (skew) => {
  skew = skew || 0.5;
  return Math.random() > skew;
};

export const randomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

export const randomText = (words) => {
  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 8,
      min: 4,
    },
    wordsPerSentence: {
      max: 16,
      min: 4,
    },
  });

  return lorem.generateWords(words);
};

export const randomString = (length) => randomText(length).substring(0, length)
  .trim();

export const randomName = (length) => randomText(length).replace(' ', '')
  .substring(0, length).trim();

export const randomUrl = (domain) => {
  domain = domain || 'http://example.com';
  return `${domain}/${(Math.random() + 1).toString(36).substring(7)}`;
};

export const randomDropdownFilter = () => {
  const filters = ['All', 'Recent', 'Popular', 'Featured'];
  return filters[Math.floor(Math.random() * filters.length)];
};

export const randomField = (inputType, options, theme, rand, itr) => {
  const isCheckboxOrRadio = inputType === 'checkbox' || inputType === 'radio';

  const FieldOptions = {
    theme,
    type: inputType,
    label: CivicThemeLabel({
      theme,
      content: options.title ? options.title : `Input title ${itr + 1}${rand ? ` ${randomString(randomInt(2, 5))}` : ''}`,
      attributes: `for="form-element-${itr}"`,
      required: options.required,
    }),
    label_display: isCheckboxOrRadio ? 'after' : 'before',
    description_position: isCheckboxOrRadio ? 'after' : 'before',
    description: {
      content: options.description ? `Input description ${itr + 1}${rand ? ` ${randomText(randomInt(4, 10))}` : ''}` : '',
    },
    control: [],
    attributes: options.form_element_attributes,
  };
  let attributes = `id="form-element-${itr}"`;
  if (typeof options.attributes !== 'undefined') {
    attributes += options.attributes;
  }

  const inputOptions = {
    theme,
    type: inputType,
    attributes,
    required: options.required,
    value: typeof options.value !== 'undefined' ? options.value : randomString(randomInt(3, 8)),
  };

  switch (inputType) {
    case 'radio':
      FieldOptions.control.push(CivicThemeRadio(inputOptions));
      break;
    case 'checkbox':
      FieldOptions.control.push(CivicThemeCheckbox(inputOptions));
      break;
    case 'select':
      FieldOptions.control.push(CivicThemeSelect({
        ...inputOptions,
        options: inputOptions.value,
      }));
      break;
    default:
      FieldOptions.control.push(CivicThemeInput(inputOptions));
  }

  return CivicThemeField(FieldOptions);
};

export const randomFields = (count, theme, rand) => {
  rand = rand || false;

  const inputTypes = [
    'text',
    'textarea',
    'tel',
    'password',
    'radio',
    'checkbox',
    'select',
  ];

  const requiredOptions = ['required', ''];

  const Fields = [];
  for (let i = 0; i < count; i++) {
    const inputType = inputTypes[Math.floor(Math.random() * inputTypes.length)];
    const required = [Math.floor(Math.random() * requiredOptions.length)];

    Fields.push(randomField(
      inputType,
      {
        required,
      },
      theme,
      rand,
      i,
    ));
  }

  return Fields;
};

export const randomLinks = (count, length, domain, prefix) => {
  const links = [];
  prefix = prefix || 'Link';
  length = length || 0;

  for (let i = 0; i < count; i++) {
    links.push({
      text: `${prefix} ${i + 1}${length ? ` ${randomString(randomInt(3, length))}` : ''}`,
      url: randomUrl(domain),
      is_new_window: randomBool(),
      is_external: randomBool(0.8),
    });
  }

  return links;
};

export const randomSentence = (words) => {
  words = words || randomInt(5, 25);
  return capitalizeFirstLetter(randomText(words));
};

export const randomTags = (count, rand) => {
  const tags = [];
  rand = rand || false;

  for (let i = 0; i < count; i++) {
    tags.push(`Topic ${i + 1}${rand ? ` ${randomString(randomInt(2, 5))}` : ''}`);
  }

  return tags;
};

// =============================================================================
// DEMO DATA GENERATORS
// =============================================================================

export const placeholder = (content = 'Content placeholder', words = 0) => `<div class="story-placeholder">${content}${words > 0 ? ` ${randomSentence(words)}` : ''}</div>`;

export const generateSlots = (names) => {
  const showSlots = boolean('Show story-slots', false, 'Slots');
  const obj = {};

  if (showSlots) {
    for (const i in names) {
      obj[names[i]] = `<div class="story-slot story-slot--${names[i]}"><code>{{ ${names[i]} }}</code></div>`;
    }
  }

  return obj;
};

export const generateItems = (count, content) => {
  const items = [];
  for (let i = 1; i <= count; i++) {
    if (typeof content === 'function') {
      items.push(content(i));
    } else {
      items.push(content);
    }
  }
  return items;
};

export const generateImage = (idx) => {
  const images = [
    'demo/images/demo1.jpg',
    'demo/images/demo2.jpg',
    'demo/images/demo3.jpg',
    'demo/images/demo4.jpg',
    'demo/images/demo5.jpg',
    'demo/images/demo6.jpg',
  ];

  idx = typeof idx !== 'undefined' ? Math.max(0, Math.min(idx, images.length)) : Math.floor(Math.random() * images.length);

  return images[idx];
};

export const generateIcon = () => './assets/icons/megaphone.svg';

export const generateInputItems = (count) => {
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push({
      id: i + 1,
      label: `Input ${i + 1}`,
      value: randomString(randomInt(3, 8)),
    });
  }
  return items;
};

export const generateSelectItems = (count) => {
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push({
      label: `Option ${i + 1}`,
      value: randomString(randomInt(3, 8)),
    });
  }
  return items;
};

export const generateSelectOptions = (count, type = 'option') => {
  const options = [];
  for (let i = 1; i <= count; i++) {
    const disabled = randomBool(0.8);
    const option = {
      type,
      is_selected: randomBool(0.8),
      is_disabled: disabled,
      label: (type === 'optgroup' ? `Group ${i}` : randomString(randomInt(3, 8))) + (disabled ? ' (disabled)' : ''),
      value: randomString(randomInt(1, 8)),
      options: type === 'optgroup' ? generateSelectOptions(count) : null,
    };
    options.push(option);
  }
  return options;
};

export const generateVideoPoster = () => 'demo/videos/demo_poster.png';

export const generateVideos = () => [
  {
    url: 'demo/videos/demo.webm',
    type: 'video/webm',
  },
  {
    url: 'demo/videos/demo.mp4',
    type: 'video/mp4',
  },
  {
    url: 'demo/videos/demo.avi',
    type: 'video/avi',
  },
];

// =============================================================================
// KNOB WRAPPERS
// =============================================================================

/**
 * Knob wrappers are poor man's story Args with additional functionality.
 *
 * The use case is to allow re-using the same pre-defined story knobs within
 * the child component in the parent component's story. But also allow the
 * parent component story to override the value of the knob or completely
 * suppress the knob from being shown.
 *
 * The wrapper provides a capability for a parent story to call a child
 * component's story:
 * 1. Without any values passed - would render a child component with its
 *    default knob values and no knobs shown.
 * 2. With some values passed - would render a child component with these
 *    values (unspecified values would use the knobs' default values) and
 *    no knobs shown.
 * 3. Without **knob values** passed and wanting to see **all** the knobs -
 *    would render a child component with its default knob values and show
 *    **all** the knobs.
 * 4. Without **knob values** passed and wanting to see **some** knobs - would
 *    render a child component with their default knob values and
 *    show **only the knobs for passed values**.
 * 5. With some **knob values** passed and wanting to see the knobs - would
 *    render a child component with **these knob values** and show the knobs
 *    only for these passed values.
 *
 * @code
 * // Render a child component with its default knob values and no knobs
 * // shown. All the component's properties will use the values set on
 * // the knobs in the child component's story.
 * const component1 = MyComponent(new StoryValues());
 *
 * // Render a child component with `title` set to `My title` and no knobs
 * // shown. Unspecified component's properties will use the values set on
 * // the knobs in the child component's story.
 * const component2 = MyComponent(new StoryValues({
 *   title: 'My title',
 * }));
 *
 * // Render a child component with its default knob values and show
 * // **all** the knobs. The values of the knobs will use the values set on
 * // the knobs in the child component's story.
 * const component3 = MyComponent();
 *
 * // Render a child component with a value from the `Theme` knob set in the
 * // child component's story and show the `Theme` knob with **that** value.
 * // Unspecified component's properties will use the values set on
 * // the knobs in the child component's story.
 * const component3 = MyComponent(new StoryValues({
 *   theme: new KnobValue(),
 * }));
 *
 * // Render a child component with a value `dark` and show the `Theme` knob
 * // with the value `dark`.
 * // Unspecified component's properties will use the values set on
 * // the knobs in the child component's story.
 * const component3 = MyComponent(new StoryValues({
 *   theme: new KnobValue('dark'),
 * }));
 * @endcode
 */

/**
 * Knob value container.
 *
 * If the value is set to null, then the default value of the knob is used and
 * the knob is shown.
 *
 * If the value is set to anything else, then this value is used and the knob is
 * shown.
 *
 * If the value is set to null, and useDefault is set to true, then the default
 * value of the knob is used and the knob is not shown.
 */
export class KnobValue {
  constructor(value = null, useDefault = false) {
    this.value = value;
    this.useDefault = useDefault;
  }

  getValue() {
    return this.value;
  }

  isUsingDefault() {
    return this.useDefault;
  }
}

/**
 * Container for the knob values passed to the stories.
 */
export class StoryValues {
  constructor(parentKnobs = {}, shouldRender = true, parentKnobs = {}) {
    this.parentKnobs = parentKnobs;
    this.parentKnobs = parentKnobs;
    this.shouldRender = shouldRender;

    /* eslint no-constructor-return: 0 */
    return new Proxy(this, {
      get: (target, prop) => {
        if (prop === 'shouldRender') {
          return target.shouldRender;
        }

        if (prop in target.parentKnobs) {
          return target.parentKnobs[prop];
        }

        if (prop in target.parentKnobs) {
          return target.parentKnobs[prop];
        }

        if (prop === 'knobTab') {
          return 'General';
        }

        return new KnobValue(null, true);
      },
    });
  }
}

/**
 * Process values passed to the knob and return a value or render a knob.
 *
 * Do not optimize this function - it is laid out in a way that is easy to
 * understand and follow the logic.
 */
const processKnob = (name, defaultValue, parent, group, knobCallback) => {
  if (parent) {
    // If parent was passed, and it is not a KnobValue instance, then it
    // represents a directly passed value that should be used without
    // rendering the knob.
    if (!(parent instanceof KnobValue)) {
      return parent;
    }

    // If parent was passed, and it is KnobValue instance set to use the default
    // value, then use the default value passed to the knob without rendering
    // the knob itself.
    if (parent.isUsingDefault()) {
      return defaultValue;
    }
  }

  if (parent === null) {
    return parent;
  }

  let val;

  if (parent === undefined) {
    // If parent was not provided - use the default value in the knob.
    val = defaultValue;
  } else if (parent.getValue() === null) {
    // If parent was provided as a KnobValue with no value - use the default
    // value in the knob.
    val = defaultValue;
  } else {
    // If parent was provided as a KnobValue with a value - use this value in
    // the knob.
    val = parent.getValue();
  }

  return knobCallback(name, val, group);
};

export const knobText = (name, value, parent, group = 'General') => processKnob(name, value, parent, group, (knobName, knobValue, knobGroup) => text(knobName, knobValue, knobGroup));

export const knobRadios = (name, options, value, parent, group = 'General') => processKnob(name, value, parent, group, (knobName, knobValue, knobGroup) => radios(knobName, options, knobValue, knobGroup));

export const knobBoolean = (name, value, parent, group = 'General') => processKnob(name, value, parent, group, (knobName, knobValue, knobGroup) => boolean(knobName, knobValue, knobGroup));

export const knobNumber = (name, value, options, parent, group = 'General') => processKnob(name, value, parent, group, (knobName, knobValue, knobGroup) => number(knobName, knobValue, options, knobGroup));

export const knobSelect = (name, options, value, parent, group = 'General') => processKnob(name, value, parent, group, (knobName, knobValue, knobGroup) => select(knobName, options, knobValue, knobGroup));

export const knobColor = (name, value, parent, group = 'General') => processKnob(name, value, parent, group, (knobName, knobValue, knobGroup) => color(knobName, knobValue, knobGroup));

export const knobOptions = (name, options, value, optionsObj, parent, group = 'General') => processKnob(name, value, parent, group, (knobName, knobValue, knobGroup) => optionsKnob(knobName, options, knobValue, optionsObj, knobGroup));

export const knobDate = (name, value, parent, group = 'General') => processKnob(name, value, parent, group, (knobName, knobValue, knobGroup) => dateKnob(knobName, knobValue, knobGroup));

/**
 * Render a component if none of the parentKnobs are of KnobValue class.
 *
 * Allows to re-use stories to collect the values without rendering the
 * component.
 */
export const shouldRender = (parentKnobs) => {
  if (parentKnobs === null || typeof parentKnobs !== 'object') return true;

  if (Object.keys(parentKnobs).length === 0 && parentKnobs.constructor === Object) {
    return true;
  }

  // If the parentKnobs are of StoryValues class, then check the shouldRender flag.
  if (parentKnobs instanceof StoryValues) {
    return parentKnobs.shouldRender;
  }

  let showKnobs = false;
  const knobsValues = Object.values(parentKnobs);

  for (let i = 0; i < knobsValues.length; i++) {
    const value = knobsValues[i];
    if (value instanceof KnobValue) {
      if (value.getValue() !== null) {
        showKnobs = true;
        break;
      }

      if (value.getValue() == null && !value.isUsingDefault()) {
        showKnobs = true;
        break;
      }
    }
  }

  return !showKnobs;
};

// =============================================================================
// DECORATORS
// =============================================================================

export const decoratorStoryWrapper = (content, context) => {
  const shouldWrap = Object.keys(context.parameters)
    .some((key) => key.startsWith('wrapper'));

  if (!shouldWrap) {
    return content();
  }

  const size = ['small', 'medium', 'large'].includes(context.parameters.wrapperSize) ? context.parameters.wrapperSize : 'medium';

  let classes = [
    'story-wrapper',
    `story-wrapper-size--${size}`,
    context.parameters.wrapperCenteredHorizontally || context.parameters.wrapperCentered ? 'story-wrapper--centered' : '',
    context.parameters.wrapperCenteredVertically || context.parameters.wrapperCentered ? 'story-wrapper--centered-both' : '',
    context.parameters.wrapperIsContainer ? 'story-wrapper--container' : '',
    context.parameters.wrapperIsResizable && (context.globals.resizer || false) ? 'story-wrapper--resizable' : '',
  ].filter(Boolean).join(' ');

  if (context.parameters.wrapperClass) {
    classes += ` ${context.parameters.wrapperClass}`;
  }

  return `<div class="${classes}">${content()}</div>`;
};

export const decoratorDocs = (content, context) => {
  if (context.parameters.docs) {
    const size = ['small', 'medium', 'large'].includes(context.parameters.docsSize) ? context.parameters.docsSize : 'medium';

    const classes = [
      'story-docs',
      `story-docs-size--${size}`,
    ].filter(Boolean).join(' ');

    if (context.parameters.docsPlacement === 'before') {
      content = `<div class="${classes}">${context.parameters.docs}</div>${typeof content === 'function' ? content() : content}`;
    } else {
      content = `${typeof content === 'function' ? content() : content}<div class="${classes}">${context.parameters.docs}</div>`;
    }
  }

  return typeof content === 'function' ? content() : content;
};
