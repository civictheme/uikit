import '../../01-atoms/checkbox/checkbox.css'; /* generated */
import '../../01-atoms/field-description/field-description.css'; /* generated */
import '../../01-atoms/field-message/field-message.css'; /* generated */
import '../../01-atoms/input/input.css'; /* generated */
import '../../01-atoms/label/label.css'; /* generated */
import '../../01-atoms/link/link.css'; /* generated */
import '../../01-atoms/radio/radio.css'; /* generated */
import '../../01-atoms/select/select.css'; /* generated */
import '../../01-atoms/textarea/textarea.css'; /* generated */
import '../../01-atoms/textfield/textfield.css'; /* generated */
import '../field/field.css'; /* generated */
import './pagination.css'; /* generated */

import Component from './pagination.twig';
import PaginationData from './pagination.stories.data';

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
  args: PaginationData.args('light'),
};
