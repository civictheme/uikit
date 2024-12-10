import Component from './single-filter.twig';

const meta = {
  title: 'Molecules/List/Single Filter',
  component: Component,
  argTypes: {
    theme: {
      control: { type: 'radio' },
      options: ['light', 'dark'],
    },
    content_top: {
      control: { type: 'text' },
    },
    title: {
      control: { type: 'text' },
    },
    form_attributes: {
      control: { type: 'text' },
    },
    form_hidden_fields: {
      control: { type: 'text' },
    },
    items: {
      control: { type: 'array' },
    },
    submit_text: {
      control: { type: 'text' },
    },
    reset_text: {
      control: { type: 'text' },
    },
    content_bottom: {
      control: { type: 'text' },
    },
    is_multiple: {
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

export const SingleFilter = {
  parameters: {
    layout: 'padded',
  },
  args: {
    theme: 'light',
    content_top: '',
    title: 'Filter results by:',
    form_attributes: '',
    form_hidden_fields: '',
    items: [
      {
        text: 'Option A',
        name: 'option_name',
        is_selected: false,
        attributes: '',
      },
      {
        text: 'Option B',
        name: 'option_name',
        is_selected: false,
        attributes: '',
      },
      {
        text: 'Option C',
        name: 'option_name',
        is_selected: false,
        attributes: '',
      },
    ],
    submit_text: 'Apply',
    reset_text: 'Clear all',
    content_bottom: '',
    is_multiple: false,
    attributes: '',
    modifier_class: '',
  },
};
