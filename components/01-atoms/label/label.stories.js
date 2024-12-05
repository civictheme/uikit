import Component from './label.twig';

const meta = {
  title: 'Atoms/Form Controls/Label',
  component: Component,
  argTypes: {
    theme: {
      control: { type: 'radio' },
      options: ['light', 'dark'],
    },
    size: {
      control: { type: 'radio' },
      options: [
        'extra-large',
        'large',
        'regular',
        'small',
        'extra-small',
        '',
      ],
    },
    content: {
      control: { type: 'text' },
    },
    for: {
      control: { type: 'text' },
    },
    is_required: {
      control: { type: 'boolean' },
    },
    allow_html: {
      control: { type: 'boolean' },
    },
    modifier_class: {
      control: { type: 'text' },
    },
    attributes: {
      control: { type: 'text' },
    },
  },
};

export default meta;

export const Label = {
  parameters: {
    layout: 'centered',
  },
  args: {
    theme: 'light',
    size: 'regular',
    content: 'Label content',
    for: '',
    is_required: false,
    allow_html: false,
    modifier_class: '',
    attributes: '',
  },
};
