import Component from './subject-card.twig';

const meta = {
  title: 'Molecules/List/Subject Card',
  component: Component,
  argTypes: {
    theme: {
      control: { type: 'radio' },
      options: ['light', 'dark'],
    },
    title: {
      control: { type: 'text' },
    },
    link: {
      control: { type: 'object' },
    },
    image: {
      control: { type: 'object' },
    },
    image_over: {
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

export const SubjectCard = {
  parameters: {
    layout: 'centered',
  },
  args: {
    theme: 'light',
    title: 'Subject card title which runs across two or three lines',
    link: {
      url: 'https://example.com',
      is_new_window: false,
    },
    image: {
      url: './demo/images/demo1.jpg',
      alt: 'Image alt text',
    },
    image_over: '',
    modifier_class: '',
    attributes: '',
  },
};
