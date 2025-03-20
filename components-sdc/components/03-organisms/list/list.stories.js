import '../../01-atoms/button/button.component.js'; /* generated */
import '../../01-atoms/button/button.css'; /* generated */
import '../../01-atoms/checkbox/checkbox.css'; /* generated */
import '../../01-atoms/chip/chip.component.js'; /* generated */
import '../../01-atoms/chip/chip.css'; /* generated */
import '../../01-atoms/field-description/field-description.css'; /* generated */
import '../../01-atoms/field-message/field-message.css'; /* generated */
import '../../01-atoms/heading/heading.css'; /* generated */
import '../../01-atoms/input/input.css'; /* generated */
import '../../01-atoms/label/label.css'; /* generated */
import '../../01-atoms/link/link.css'; /* generated */
import '../../01-atoms/paragraph/paragraph.css'; /* generated */
import '../../01-atoms/popover/popover.css'; /* generated */
import '../../01-atoms/radio/radio.css'; /* generated */
import '../../01-atoms/select/select.css'; /* generated */
import '../../01-atoms/tag/tag.css'; /* generated */
import '../../01-atoms/textarea/textarea.css'; /* generated */
import '../../01-atoms/textfield/textfield.css'; /* generated */
import '../../02-molecules/field/field.css'; /* generated */
import '../../02-molecules/group-filter/group-filter.component.js'; /* generated */
import '../../02-molecules/group-filter/group-filter.css'; /* generated */
import '../../02-molecules/navigation-card/navigation-card.css'; /* generated */
import '../../02-molecules/pagination/pagination.css'; /* generated */
import '../../02-molecules/promo-card/promo-card.css'; /* generated */
import '../../02-molecules/single-filter/single-filter.component.js'; /* generated */
import '../../02-molecules/single-filter/single-filter.css'; /* generated */
import '../../02-molecules/snippet/snippet.css'; /* generated */
import './list.css'; /* generated */

import Component from './list.twig';
import ListData from './list.stories.data';

const meta = {
  title: 'Organisms/List',
  component: Component,
  argTypes: {
    title: {
      control: { type: 'text' },
    },
    link_above: {
      control: { type: 'object' },
    },
    filters: {
      control: { type: 'text' },
    },
    results_count: {
      control: { type: 'text' },
    },
    rows_above: {
      control: { type: 'text' },
    },
    rows: {
      control: { type: 'text' },
    },
    rows_below: {
      control: { type: 'text' },
    },
    empty: {
      control: { type: 'text' },
    },
    pagination: {
      control: { type: 'text' },
    },
    footer: {
      control: { type: 'text' },
    },
    link_below: {
      control: { type: 'object' },
    },
    theme: {
      control: { type: 'radio' },
      options: ['light', 'dark'],
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

export const List = {
  parameters: {
    layout: 'padded',
  },
  args: ListData.args('light'),
};

export const ListDark = {
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'Dark',
    },
  },
  args: ListData.args('dark'),
};

export const ListGroupFilters = {
  parameters: {
    layout: 'padded',
  },
  args: ListData.args('light', { group: true }),
};

export const ListNavigationCard = {
  parameters: {
    layout: 'padded',
  },
  args: ListData.args('light', { component: 'navigation' }),
};

export const ListSnippet = {
  parameters: {
    layout: 'padded',
  },
  args: ListData.args('light', { component: 'snippet', columnCount: 1 }),
};
