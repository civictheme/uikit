import Component from './navigation.twig';

const meta = {
  title: 'Organisms/Navigation/Navigation',
  component: Component,
  argTypes: {
    theme: {
      control: { type: 'radio' },
      options: ['light', 'dark'],
    },
    name: {
      control: { type: 'text' },
    },
    items: {
      control: { type: 'array' },
    },
    title: {
      control: { type: 'text' },
    },
    type: {
      control: { type: 'radio' },
      options: ['none', 'inline', 'dropdown', 'drawer'],
    },
    dropdown_columns: {
      control: { type: 'number' },
    },
    dropdown_columns_fill: {
      control: { type: 'boolean' },
    },
    is_animated: {
      control: { type: 'boolean' },
    },
    menu_id: {
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

export const Navigation = {
  parameters: {
    layout: 'centered',
  },
  args: {
    theme: 'light',
    name: '',
    title: 'Navigation title',
    type: 'none',
    items: [
      {
        title: 'Menu item 1',
        url: 'https://example.com/menu-item-1',
        in_active_trail: false,
        is_expanded: false,
        below: [
          {
            title: 'Menu subitem 1',
            url: 'https://example.com/menu-item-1',
            in_active_trail: false,
            is_expanded: false,
            below: false,
          },
          {
            title: 'Menu subitem 2',
            url: 'https://example.com/menu-item-1',
            in_active_trail: false,
            is_expanded: false,
            below: [
              {
                title: 'Menu subsubitem 1',
                url: 'https://example.com/menu-item-1',
                in_active_trail: false,
                is_expanded: false,
                below: false,
              },
              {
                title: 'Menu subsubitem 2',
                url: 'https://example.com/menu-item-1',
                in_active_trail: false,
                is_expanded: false,
                below: false,
              },
            ],
          },
        ],
      },
      {
        title: 'Menu item 2',
        url: 'https://example.com/menu-item-2',
        in_active_trail: false,
        is_expanded: false,
      },
    ],
    dropdown_columns: 1,
    dropdown_columns_fill: false,
    is_animated: false,
    menu_id: 'navigation',
    attributes: '',
    modifier_class: '',
  },
};
