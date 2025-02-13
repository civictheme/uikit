import Component from './search.twig';

const meta = {
  title: 'Molecules/Search',
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
    hide_on_mobile: {
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

export const Search = {
  parameters: {
    layout: 'centered',
  },
  args: {
    theme: 'light',
    text: 'Search',
    url: '/search',
    hide_on_mobile: false,
    modifier_class: '',
    attributes: '',
  },
};
