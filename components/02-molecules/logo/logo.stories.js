import Component from './logo.twig';
import Constants from '../../../dist/constants.json'; // eslint-disable-line import/no-unresolved

const meta = {
  title: 'Molecules/Logo',
  component: Component,
  argTypes: {
    theme: {
      control: { type: 'radio' },
      options: ['light', 'dark'],
    },
    type: {
      control: { type: 'radio' },
      options: ['default', 'stacked', 'inline', 'inline-stacked'],
    },
    logos: {
      control: { type: 'object' },
    },
    url: {
      control: { type: 'text' },
    },
    title: {
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

export const Logo = {
  parameters: {
    layout: 'centered',
  },
  args: {
    theme: 'light',
    type: 'default',
    logos: {
      primary: {
        mobile: {
          url: Constants.LOGOS.light.primary.mobile,
          alt: 'Primary logo mobile alt text',
        },
        desktop: {
          url: Constants.LOGOS.light.primary.desktop,
          alt: 'Primary logo desktop alt text',
        },
      },
      secondary: {
        mobile: {
          url: Constants.LOGOS.light.secondary.mobile,
          alt: 'Secondary logo mobile alt text',
        },
        desktop: {
          url: Constants.LOGOS.light.secondary.desktop,
          alt: 'Secondary logo desktop alt text',
        },
      },
    },
    url: 'https://example.com',
    title: 'Logo title',
    attributes: '',
    modifier_class: '',
  },
};
