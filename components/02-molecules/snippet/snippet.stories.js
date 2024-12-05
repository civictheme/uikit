import Component from './snippet.twig';

const meta = {
  title: 'Molecules/List/Snippet',
  component: Component,
  argTypes: {
    theme: {
      control: { type: 'radio' },
      options: ['light', 'dark'],
    },
    title: {
      control: { type: 'text' },
    },
    summary: {
      control: { type: 'text' },
    },
    link: {
      control: { type: 'object' },
    },
    tags: {
      control: { type: 'array' },
    },
    content_top: {
      control: { type: 'text' },
    },
    content_middle: {
      control: { type: 'text' },
    },
    content_bottom: {
      control: { type: 'text' },
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

export const Snippet = {
  parameters: {
    layout: 'centered',
  },
  args: {
    theme: 'light',
    title: 'Snippet name which runs across two or three lines',
    summary: 'Summary of the snippet',
    link: {
      url: 'https://example.com',
      is_new_window: false,
    },
    tags: [
      'Tag 1',
      'Tag 2',
    ],
    content_top: '',
    content_middle: '',
    content_bottom: '',
    modifier_class: '',
    attributes: '',
  },
};
