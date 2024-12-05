import Component from './pagination.twig';

const meta = {
  title: 'Molecules/List/Pagination',
  component: Component,
  argTypes: {
    theme: {
      control: { type: 'radio' },
      options: ['light', 'dark'],
    },
    heading_id: {
      control: { type: 'text' },
    },
    items: {
      control: { type: 'array' },
    },
    items_modifier_class: {
      control: { type: 'text' },
    },
    current: {
      control: { type: 'number' },
    },
    items_per_page_title: {
      control: { type: 'text' },
    },
    items_per_page_options: {
      control: { type: 'array' },
    },
    items_per_page_name: {
      control: { type: 'text' },
    },
    items_per_page_id: {
      control: { type: 'text' },
    },
    items_per_page_attributes: {
      control: { type: 'text' },
    },
    use_ellipsis: {
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

export const Pagination = {
  parameters: {
    layout: 'padded',
  },
  args: {
    theme: 'light',
    heading_id: 'ct-pagination-demo',
    items: {
      previous: {
        href: 'http://example.com',
      },
      pages: {
        1: { href: 'http://example.com' },
        2: { href: 'http://example.com' },
        3: { href: 'http://example.com' },
      },
      next: {
        href: 'http://example.com',
      },
    },
    items_modifier_class: '',
    current: 1,
    total_pages: 3,
    items_per_page_title: 'Items per page',
    items_per_page_options: [
      {
        type: 'option',
        label: 10,
        value: 10,
        is_selected: false,
      },
      {
        type: 'option',
        label: 20,
        value: 20,
        is_selected: true,
      },
      {
        type: 'option',
        label: 50,
        value: 50,
        is_selected: false,
      },
      {
        type: 'option',
        label: 100,
        value: 100,
        is_selected: false,
      },
    ],
    items_per_page_name: 'items_per_page_name',
    items_per_page_id: 'items-per-page-id',
    items_per_page_attributes: '',
    use_ellipsis: false,
    modifier_class: '',
    attributes: '',
  },
};
