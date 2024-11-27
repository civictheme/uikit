import Component from './chip.twig';
import './chip.event.stories';

const meta = {
  component: Component,
  argTypes: {
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
    },
    kind: {
      control: { type: 'select' },
      options: {
        Default: 'default',
        Input: 'input',
      },
    },
    size: {
      control: { type: 'select' },
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
    is_selected: {
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
    content: 'Chip label',
    is_selected: false,
    is_multiple: false,
  },
};
