/**
 * CivicTheme Skip Link component stories.
 */

import Component from './skip-link.twig';

const meta = {
  title: 'Organisms/Skip Link',
  component: Component,
  argTypes: {
    theme: {
      control: { type: 'radio' },
      options: ['light', 'dark'],
    },
    text: {
      control: { type: 'text' },
    },
    url: {
      control: { type: 'text' },
    },
    modifier_class: {
      control: { type: 'text' },
    },
  },
};

export default meta;

export const SkipLink = {
  parameters: {
    layout: 'fullscreen',
    storyDocs: 'Press TAB on the keyboard for the Skip Link to appear',
    storyDocsSize: 'large',
    storyDocsPlacement: 'after',
  },
  args: {
    theme: 'light',
    text: 'Skip to main content',
    url: '#main-content',
    modifier_class: '',
  },
};
