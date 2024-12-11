import Component from './side-navigation.twig';

const meta = {
  title: 'Organisms/Navigation/Side Navigation',
  component: Component,
  argTypes: {
    theme: {
      control: { type: 'radio' },
      options: ['light', 'dark'],
    },
    items: {
      control: { type: 'array' },
    },
    title: {
      control: { type: 'text' },
    },
    vertical_spacing: {
      control: { type: 'radio' },
      options: ['none', 'top', 'bottom', 'both'],
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

export const SideNavigation = {
  parameters: {
    layout: 'centered',
  },
  args: {
    theme: 'light',
    title: 'Side Navigation title',
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
    vertical_spacing: 'none',
    attributes: '',
    modifier_class: '',
  },
};
