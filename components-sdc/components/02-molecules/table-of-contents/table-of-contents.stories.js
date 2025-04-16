import Component from './table-of-contents.stories.twig';

const meta = {
  title: 'Molecules/Table Of Contents',
  component: Component,
  argTypes: {
    theme: {
      control: { type: 'radio' },
      options: ['light', 'dark'],
    },
    title: {
      control: { type: 'text' },
    },
    position: {
      control: { type: 'radio' },
      options: ['before', 'after', 'prepend', 'append'],
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

export const TableOfContents = {
  args: {
    theme: 'light',
    title: 'On this page',
    links: [
      {
        title: 'Link 1',
        url: '/',
      },
      {
        title: 'Link 2',
        url: '/',
      },
      {
        title: 'Link 3',
        url: '/',
      },
    ],
    position: 'before',
    modifier_class: '',
    attributes: '',
  },
};

export const TableOfContentsAutomatic = {
  parameters: {
    layout: 'centered',
  },
  args: {
    theme: 'light',
    title: 'On this page',
    anchor_selector: 'h2',
    scope_selector: '.ct-basic-content',
    position: 'before',
    modifier_class: '',
    attributes: '',
  },
};
