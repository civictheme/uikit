import Component from './navigation-card.twig';
import Constants from '../../../dist/constants.json'; // eslint-disable-line import/no-unresolved

const meta = {
  title: 'Molecules/List/Navigation Card',
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
    image: {
      control: { type: 'object' },
    },
    image_as_icon: {
      control: { type: 'boolean' },
    },
    icon: {
      control: { type: 'select' },
      options: Constants.ICONS, // replace with actual icon options
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

export const NavigationCard = {
  parameters: {
    layout: 'centered',
  },
  args: {
    theme: 'light',
    title: 'Navigation card heading which runs across two or three lines',
    summary: 'Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution. User generated content in real-time will have multiple touchpoints for offshoring.',
    link: {
      text: 'Link',
      url: 'https://example.com',
      is_new_window: false,
      is_external: false,
    },
    image: {
      url: './demo/images/demo1.jpg',
      alt: 'Image alt text',
    },
    image_as_icon: false,
    icon: '', // replace with actual icon value
    image_over: '',
    content_top: '',
    content_middle: '',
    content_bottom: '',
    modifier_class: '',
    attributes: '',
  },
};
