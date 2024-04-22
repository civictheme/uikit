//
// Centralised helpers for all storybook components.
//

import { boolean } from '@storybook/addon-knobs';
import { LoremIpsum } from 'lorem-ipsum';
import CivicThemeInput from '../01-atoms/input/input.twig';
import CivicThemeSelect from '../01-atoms/select/select.twig';
import CivicThemeCheckbox from '../01-atoms/checkbox/checkbox.twig';
import CivicThemeRadio from '../01-atoms/radio/radio.twig';
import CivicThemeFormElement
  from '../02-molecules/form-element/form-element.twig';
import CivicThemeLabel from '../01-atoms/label/label.twig';

// Utilities.

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

export const indexedString = 'TODO';

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

// Random generators.

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

export const randomUrl = (domain) => {
  domain = domain || 'http://example.com';
  return `${domain}/${(Math.random() + 1).toString(36).substring(7)}`;
};

export const randomDropdownFilter = 'TODO';

export const randomFormElement = (inputType, options, theme, rand, itr) => {
  const isCheckboxOrRadio = inputType === 'checkbox' || inputType === 'radio';

  const formElementOptions = {
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
    children: [],
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
      formElementOptions.children.push(CivicThemeRadio(inputOptions));
      break;
    case 'checkbox':
      formElementOptions.children.push(CivicThemeCheckbox(inputOptions));
      break;
    case 'select':
      formElementOptions.children.push(CivicThemeSelect({
        ...inputOptions,
        options: inputOptions.value,
      }));
      break;
    default:
      formElementOptions.children.push(CivicThemeInput(inputOptions));
  }

  return CivicThemeFormElement(formElementOptions);
};

export const randomFormElements = (count, theme, rand) => {
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

  const formElements = [];
  for (let i = 0; i < count; i++) {
    const inputType = inputTypes[Math.floor(Math.random() * inputTypes.length)];
    const required = [Math.floor(Math.random() * requiredOptions.length)];

    formElements.push(randomFormElement(
      inputType,
      {
        required,
      },
      theme,
      rand,
      i,
    ));
  }

  return formElements;
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

// Demo data generators

export const generateIcon = () => './assets/icons/megaphone.svg';

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

export const generateInputItems = 'TODO';

export const generateItems = (count, content) => {
  const items = [];
  for (let i = 1; i <= count; i++) {
    items.push(content);
  }
  return items;
};

export const generateSelectItems = 'TODO';

export const generateSlots = (names) => {
  const showSlots = boolean('Show story-slots', false, 'Slots');
  const obj = {};

  if (showSlots) {
    for (const i in names) {
      obj[names[i]] = `<div class="story-slot story-slot--${names[i]}">{{ ${names[i]} }}</div>`;
    }
  }

  return obj;
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
