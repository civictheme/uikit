/**
 * CivicTheme Figure component stories.
 */

import Component from './figure.twig';

const baseArgs = {
  theme: 'light',
  url: './demo/images/demo1.jpg',
  alt: 'Image alt text',
  width: '600',
  height: '',
  caption: 'Figure image caption.',
  alignment: 'none',
  modifier_class: '',
  attributes: null,
};

const wysiwygText = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc auctor risus nec nisl tempor, vel sodales metus bibendum. Sed aute in sed consequat veniam excepteur minim mollit. Deserunt in ex dolore cupidatat eu id sint eu sed nisi anim minim ut non commodo dolore nisi.</p>`;

const meta = {
  title: 'Molecules/Figure',
  component: Component,
  argTypes: {
    theme: {
      control: { type: 'radio' },
      options: ['light', 'dark'],
    },
    url: {
      control: { type: 'text' },
    },
    alt: {
      control: { type: 'text' },
    },
    width: {
      control: { type: 'text' },
    },
    height: {
      control: { type: 'text' },
    },
    caption: {
      control: { type: 'text' },
    },
    alignment: {
      control: { type: 'radio' },
      options: ['none', 'left', 'center', 'right'],
    },
    modifier_class: {
      control: { type: 'text' },
    },
  },
};

export default meta;

export const Figure = {
  parameters: {
    layout: 'centered',
  },
  args: baseArgs,
};

export const FigureAlignment = {
  parameters: {
    layout: 'padded',
  },
  render: (args) => `<div style="width: 100%;">${Component(args)}</div>`,
  args: {
    ...baseArgs,
    alignment: 'left',
  },
};

export const FigureWysiwygAlignment = {
  parameters: {
    layout: 'padded',
  },
  render: (args) => `
    <div class="ct-basic-content ct-theme-light" style="max-width: 48rem;">
      ${wysiwygText}
      ${Component(args)}
      ${wysiwygText}
    </div>
  `,
  args: {
    ...baseArgs,
    alignment: 'left',
    width: '300',
  },
};
