/**
 * CivicTheme Inline Filter component stories.
 */

import Component from './inline-filter.twig';
import InlineFilterData from './inline-filter.stories.data';

const meta = {
  title: 'Molecules/List/Inline Filter',
  component: Component,
  argTypes: {
    theme: {
      control: { type: 'radio' },
      options: ['light', 'dark'],
    },
    items: {
      control: { type: 'text' },
    },
    submit_text: {
      control: { type: 'text' },
    },
    items_end: {
      control: { type: 'text' },
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

export const InlineFilter = {
  parameters: {
    layout: 'padded',
  },
  args: InlineFilterData.args('light'),
};

export const InlineFilterDark = {
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'Dark',
    },
  },
  args: InlineFilterData.args('dark'),
};
