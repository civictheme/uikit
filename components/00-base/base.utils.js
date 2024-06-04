//
// Centralised utilities for all Storybook stories.
//

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

export const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

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

export const placeholder = (content = 'Content placeholder') => `<div class="story-placeholder">${content}</div>`;

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

export const randomString = (length) => randomText(length).substring(0, length).trim();

export const randomName = (length) => randomText(length).replace(' ', '').substring(0, length).trim();

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

export const generateOptions = (numOfOptions, optionType = 'option') => {
  const options = [];
  for (let i = 1; i <= numOfOptions; i++) {
    const option = {
      type: optionType,
      selected: false,
      label: optionType === 'optgroup' ? `Group ${i}` : randomString(randomInt(3, 8)),
      value: randomString(randomInt(1, 8)),
      options: optionType === 'optgroup' ? generateOptions(numOfOptions) : null,
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
 * Knob wrappers are poor man's Args with additional functionality.
 *
 * The use case is to allow re-using the same pre-defined knob within the child
 * component in the parent component. But also allow the parent to override the
 * value of the knob or completely suppress the knob from being shown.
 *
 * The capability that the wrappers provide are:
 * 1. Each knob to have its own default value visible in UI.
 * 2. If a parent provides a value, then that value is used directly. No knob
 *    is rendered.
 * 3. Allow parent to choose which specific child's knob is shown.
 * 4. Allow parent to choose which specific child's knob is shown, but with a
 *    custom value.
 *
 * @code
 * // In the story of the parent component.
 *
 * // Define some values.
 * knobs.theme = radios();
 *
 * // Show the child component.
 * knobs.logo = boolean('Show logo', true, generalKnobTab) ? Logo({
 *   knobTab: 'Logo',
 *   // Use the value of the parent's knob. Knob is not rendered.
 *   theme: knobs.theme,
 *   // Use a value directly. Knob is not rendered.
 *   url: randomUrl('example2.com'),
 *   // Use a default value from the component's story. Knob is rendered.
 *   type: new KnobValue(),
 *   // Use a custom value set in this story. Knob is rendered.
 *   title: new KnobValue('This is a Logo in Header'),
 * }) : null;
 * @endcode
 *
 * In this example the child component is not actually rendered, but the values
 * of the knobs are used in the parent component's story that includes the child
 * component through twig, so only the values are used, not the child's
 * component rendered output.
 *
 * In order to provide the functionality where either a whole rendered component
 * or just it's knobs/values are returned to the parent component, the child
 * component must do 3 things:
 *
 * 1. Define `props` object as a very first argument in the component's
 *    function.
 *    export const Logo = (props = {}) => {}
 *
 * 2. Use the wrapper functions to get the values of the knobs. Pass the parent
 *    component's knob value as an argument.
 *
 * 3. Check the provided props and render the component or just the
 *    knobs if parent value is provided. If the props do not contain any values
 *    of the KnobValue class, then the component is rendered directly.
 *    Otherwise, the knobs are rendered.
 *
 * KnobValue class is used to provide a way to pass the value of a knob to a
 * child component, but also allow the parent component to override the value.
 *
 * It is also used to differentiate between a value that is set by the parent
 * component directly to be used by a child component vs a value that is passed
 * to the child's knob as a default value of that knob.
 *
 * If an empty KnobValue object is passed to a knob, then the knob is rendered
 * with its own default value.
 */
export class KnobValue {
  constructor(value = null) {
    this.value = value;
  }

  getValue() {
    return this.value;
  }
}

/**
 * Render a component if none of the props are of KnobValue class.
 */
export const shouldRender = (props) => {
  if (props === null || typeof props !== 'object') return true;

  if (Object.keys(props).length === 0 && props.constructor === Object) {
    return true;
  }

  return !Object.values(props).some((value) => value instanceof KnobValue);
};

export const knobText = (name, value, parent, group = 'General') => {
  if (parent === undefined || parent === null) {
    return text(name, value, group);
  }
  if (parent instanceof KnobValue) {
    if (parent.getValue() === null) {
      return text(name, value, group);
    }
    return text(name, parent.getValue(), group);
  }
  return parent;
};

export const knobRadios = (name, options, value, parent, group = 'General') => {
  if (parent === undefined || parent === null) {
    return radios(name, options, value, group);
  }
  if (parent instanceof KnobValue) {
    if (parent.getValue() === null) {
      return radios(name, options, value, group);
    }
    return radios(name, options, parent.getValue(), group);
  }
  return parent;
};

export const knobBoolean = (name, value, parent, group = 'General') => {
  if (parent === undefined || parent === null) {
    return boolean(name, value, group);
  }
  if (parent instanceof KnobValue) {
    if (parent.getValue() === null) {
      return boolean(name, value, group);
    }
    return boolean(name, parent.getValue(), group);
  }
  return parent;
};

export const knobNumber = (name, value, options, parent, group = 'General') => {
  if (parent === undefined || parent === null) {
    return number(name, value, options, group);
  }
  if (parent instanceof KnobValue) {
    if (parent.getValue() === null) {
      return number(name, value, options, group);
    }
    return number(name, parent.getValue(), options, group);
  }
  return parent;
};

export const knobSelect = (name, options, value, parent, group = 'General') => {
  if (parent === undefined || parent === null) {
    return select(name, options, value, group);
  }
  if (parent instanceof KnobValue) {
    if (parent.getValue() === null) {
      return select(name, options, value, group);
    }
    return select(name, options, parent.getValue(), group);
  }
  return parent;
};

export const knobColor = (name, value, parent, group = 'General') => {
  if (parent === undefined || parent === null) {
    return color(name, value, group);
  }
  if (parent instanceof KnobValue) {
    if (parent.getValue() === null) {
      return color(name, value, group);
    }
    return color(name, parent.getValue(), group);
  }
  return parent;
};

export const knobOptions = (name, options, value, optionsObj, parent, group = 'General') => {
  if (parent === undefined || parent === null) {
    return optionsKnob(name, options, value, optionsObj, group);
  }
  if (parent instanceof KnobValue) {
    if (parent.getValue() === null) {
      return optionsKnob(name, options, value, optionsObj, group);
    }
    return optionsKnob(name, options, parent.getValue(), optionsObj, group);
  }
  return parent;
};

export const knobDate = (name, value, parent, group = 'General') => {
  if (parent === undefined || parent === null) {
    return dateKnob(name, value, group);
  }
  if (parent instanceof KnobValue) {
    if (parent.getValue() === null) {
      return dateKnob(name, value, group);
    }
    return dateKnob(name, parent.getValue(), group);
  }
  return parent;
};

// =============================================================================
// DECORATORS
// =============================================================================

export const decoratorStoryWrapper = (content, context) => {
  const shouldWrap = Object.keys(context.parameters).some((key) => key.startsWith('wrapper'));

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
