import Component from './selected-filters.twig';

const meta = {
  title: 'Organisms/Selected Filters',
  component: Component,
  argTypes: {
    theme: {
      control: { type: 'radio' },
      options: ['light', 'dark'],
    },
    title: {
      control: { type: 'text' },
      description: 'Title of the selected filters section',
    },
    filters: {
      control: { type: 'object' },
      description: 'Array of filter objects with url, text, and label properties',
    },
    clear_link: {
      control: { type: 'object' },
      description: 'Clear all link configuration object',
    },
    attributes: {
      control: { type: 'text' },
      description: 'Additional HTML attributes',
    },
    modifier_class: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
};

export default meta;

export const SelectedFilters = {
  args: {
    theme: 'light',
    title: 'Selected filters: ',
    filters: [
      {
        text: 'Category: News',
        url: '#',
        label: 'Remove filter: Category News',
      },
      {
        text: 'Topic: Technology',
        url: '#',
        label: 'Remove filter: Topic Technology',
      },
      {
        text: 'Date: Last month',
        url: '#',
        label: 'Remove filter: Date Last month',
      },
    ],
    clear_link: {
      text: 'Clear all',
      url: '#',
      type: 'secondary',
      size: 'regular',
      icon: 'close-outline',
      icon_placement: 'after',
    },
  },
};

export const SelectedFiltersDark = {
  args: {
    ...SelectedFilters.args,
    theme: 'dark',
  },
};
