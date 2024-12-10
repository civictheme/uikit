import Component from './promo-card.twig';

const meta = {
  title: 'Molecules/List/Promo Card',
  component: Component,
  argTypes: {
    theme: {
      control: { type: 'radio' },
      options: ['light', 'dark'],
    },
    subtitle: {
      control: { type: 'text' },
    },
    date: {
      control: { type: 'text' },
    },
    date_end: {
      control: { type: 'text' },
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
    image_over: {
      control: { type: 'text' },
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

export const PromoCard = {
  parameters: {
    layout: 'centered',
  },
  args: {
    theme: 'light',
    subtitle: 'Subtitle',
    date: '20 Jan 2023 11:00',
    date_iso: '',
    date_end: '21 Jan 2023 15:00',
    date_end_iso: '',
    title: 'Promo card name which runs across two or three lines',
    summary: 'Summary',
    link: {
      url: 'https://example.com',
      is_external: false,
      is_new_window: false,
    },
    image: {
      url: './demo/images/demo1.jpg',
      alt: 'Image alt text',
    },
    tags: [
      'Tag 1',
      'Tag 2',
    ],
    content_top: '',
    image_over: '',
    content_middle: '',
    content_bottom: '',
    modifier_class: '',
    attributes: '',
  },
};
