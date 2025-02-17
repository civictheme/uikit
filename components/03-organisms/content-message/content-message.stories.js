import Component from './content-message.twig';

const meta = {
  title: 'Organisms/Content Message',
  component: Component,
  argTypes: {
    theme: {
      control: { type: 'radio' },
      options: ['light', 'dark'],
    },
    type: {
      control: { type: 'select' },
      options: ['information', 'error', 'warning', 'success'],
    },
    content: {
      control: { type: 'text' },
    },
    vertical_spacing: {
      control: { type: 'radio' },
      options: ['none', 'top', 'bottom', 'both'],
    },
    with_background: {
      control: { type: 'boolean' },
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

export const ContentMessage = {
  parameters: {
    layout: 'centered',
  },
  args: {
    theme: 'light',
    title: 'The information on this page is currently being updated.',
    type: 'information',
    content: 'Message description',
    attributes: '',
    modifier_class: '',
  },
};
