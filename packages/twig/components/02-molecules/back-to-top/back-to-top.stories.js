/**
 * CivicTheme Back to Top component stories.
 */

import Component from './back-to-top.stories.twig';

const meta = {
  title: 'Molecules/Back To Top',
  component: Component,
  argTypes: {
    attributes: {
      control: { type: 'text' },
    },
    modifier_class: {
      control: { type: 'text' },
    },
  },
};

export default meta;

export const BackToTop = {
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
};
