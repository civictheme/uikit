/**
 * CivicTheme Back to Top component stories.
 */

import Component from './back-to-top.stories.twig';

const meta = {
  title: 'Molecules/Back To Top',
  component: Component,
  argTypes: {
    modifier_class: {
      control: { type: 'text' },
    },
  },
};

export default meta;

export const BackToTop = {
  parameters: {
    layout: 'fullscreen',
    storyDocs: 'Back To Top button appears when the bottom of the red rectangle reaches the top of the page.',
    storyDocsSize: 'medium',
  },
  args: {},
};
