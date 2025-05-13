/**
 * CivicTheme Chip component stories.
 */

import Component from './chip.twig';
import './chip.event.stories';

const meta = {
  title: 'Atoms/Chip',
  component: Component,
  argTypes: {
    theme: {
      control: { type: 'radio' },
      options: ['light', 'dark'],
    },
    kind: {
      control: { type: 'radio' },
      options: {
        Default: 'default',
        Input: 'input',
        Link: 'link',
      },
    },
    size: {
      control: { type: 'radio' },
      options: {
        Large: 'large',
        Regular: 'regular',
        Small: 'small',
        None: '',
      },
    },
    content: {
      control: { type: 'text' },
    },
    url: {
      control: { type: 'text' },
    },
    label: {
      control: { type: 'text' },
    },
    is_selected: {
      control: { type: 'boolean' },
    },
    is_disabled: {
      control: { type: 'boolean' },
    },
    is_dismissible: {
      control: { type: 'boolean' },
    },
    is_multiple: {
      control: { type: 'boolean' },
    },
    attributes: {
      control: { type: 'text' },
    },
    modifier_class: {
      control: { type: 'text' },
    },
  },
};

export default meta;

export const Chip = {
  parameters: {
    layout: 'centered',
  },
  args: {
    theme: 'light',
    kind: 'default',
    size: 'regular',
    content: 'Chip default',
    is_selected: false,
    is_multiple: false,
    is_disabled: false,
  },
};

export const ChipLink = {
  parameters: {
    layout: 'centered',
  },
  args: {
    theme: 'light',
    kind: 'link',
    size: 'regular',
    url: '#',
    label: 'Chip label',
    content: 'Chip link',
    is_disabled: false,
    is_dismissible: true,
    is_selected: false,
    is_multiple: false,
  },
};
