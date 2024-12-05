import Component from './button.twig';

const meta = {
  title: 'Atoms/Form Controls/Button',
  component: Component,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    theme: {
      control: { type: 'radio' },
      options: ['light', 'dark'],
    },
    text: {
      control: { type: 'text' },
    },
    type: {
      control: { type: 'radio' },
      options: ['primary', 'secondary', 'tertiary'],
    },
    size: {
      control: { type: 'radio' },
      options: ['large', 'regular', 'small'],
    },
    kind: {
      control: { type: 'radio' },
      options: ['button', 'link', 'reset', 'submit'],
    },
    url: {
      control: { type: 'text' },
    },
    is_new_window: {
      control: { type: 'boolean' },
    },
    is_disabled: {
      control: { type: 'boolean' },
    },
    is_external: {
      control: { type: 'boolean' },
    },
    allow_html: {
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

export const Button = {
  args: {
    theme: 'light',
    text: 'My title',
    type: 'primary',
    kind: 'button',
    allow_html: 'test',
  },
};
