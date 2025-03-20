import '../../01-atoms/button/button.component.js'; /* generated */
import '../../01-atoms/button/button.css'; /* generated */
import '../../01-atoms/checkbox/checkbox.css'; /* generated */
import '../../01-atoms/field-description/field-description.css'; /* generated */
import '../../01-atoms/field-message/field-message.css'; /* generated */
import '../../01-atoms/input/input.css'; /* generated */
import '../../01-atoms/label/label.css'; /* generated */
import '../../01-atoms/link/link.css'; /* generated */
import '../../01-atoms/popover/popover.css'; /* generated */
import '../../01-atoms/radio/radio.css'; /* generated */
import '../../01-atoms/select/select.css'; /* generated */
import '../../01-atoms/textarea/textarea.css'; /* generated */
import '../../01-atoms/textfield/textfield.css'; /* generated */
import '../field/field.css'; /* generated */
import './group-filter.component.js'; /* generated */
import './group-filter.css'; /* generated */

import Component from './group-filter.twig';
import GroupFilterData from './group-filter.stories.data';

const meta = {
  title: 'Molecules/List/Group Filter',
  component: Component,
  argTypes: {
    theme: {
      control: { type: 'radio' },
      options: ['light', 'dark'],
    },
    title: {
      control: { type: 'text' },
    },
    filters: {
      control: { type: 'array' },
    },
    submit_text: {
      control: { type: 'text' },
    },
    form_attributes: {
      control: { type: 'text' },
    },
    form_hidden_fields: {
      control: { type: 'text' },
    },
    content_top: {
      control: { type: 'text' },
    },
    content_bottom: {
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

export const GroupFilter = {
  parameters: {
    layout: 'padded',
  },
  args: GroupFilterData.args('light'),
};

export const GroupFilterDark = {
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'Dark',
    },
  },
  args: GroupFilterData.args('dark'),
};
