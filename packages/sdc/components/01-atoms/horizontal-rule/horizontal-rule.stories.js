/**
 * CivicTheme Horizontal Rule component stories.
 */

import Component from './horizontal-rule.twig';

const meta = {
  title: 'Atoms/Horizontal Rule',
  component: Component,
  argTypes: {
    theme: {
      control: { type: 'radio' },
      options: ['light', 'dark'],
    },
    modifier_class: {
      control: { type: 'text' },
    },
  },
};

export default meta;

export const HorizontalRule = {
  args: {
    theme: 'light',
    modifier_class: '',
    attributes: null,
  },
};
