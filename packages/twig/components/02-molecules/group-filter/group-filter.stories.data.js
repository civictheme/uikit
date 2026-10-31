import Field from '../field/field.twig';
import FieldData from '../field/field.stories.data';

// The control markup is built from the atoms and passed into the field
// component's `children` slot.
const field = (args) => Field({ ...args, children: FieldData.children(args) });

export default {
  args: (theme = 'light', options = {}) => {
    let selectedFilters = {};
    if (options.selectedFilters) {
      selectedFilters = {
        show_selected_filters: true,
        selected_title: 'Selected filters:',
        selected_filters: [
          {
            text: 'Option A',
            url: '#',
            label: 'Selected filter: Option A - Click to remove filter.',
          },
          {
            text: 'Option B',
            url: '#',
            label: 'Selected filter: Option B - Click to remove filter.',
          },
          {
            text: 'Option C',
            url: '#',
            label: 'Selected filter: Option C - Click to remove filter.',
          },
        ],
        selected_clear_link: {
          text: 'Clear all',
          url: '#',
          type: 'secondary',
          size: 'regular',
          icon: 'close-outline',
          icon_placement: 'after',
        },
      };
    }
    return {
      theme,
      title: 'Filter results by:',
      filters: [
        {
          title: `Filter 1`,
          content: [
            field({
              ...FieldData.args(theme),
              type: 'checkbox',
              is_group: true,
              description: null,
              message: null,
              orientation: 'vertical',
            }),
          ],
        },
        {
          title: `Filter 2`,
          content: [
            field({
              ...FieldData.args(theme),
              type: 'radio',
              is_group: true,
              description: null,
              message: null,
              orientation: 'vertical',
            }),
            field({
              ...FieldData.args(theme),
              description: null,
              message: null,
              orientation: 'vertical',
            }),
          ].join(''),
        },
      ],
      submit_text: 'Submit',
      form_attributes: null,
      form_hidden_fields: null,
      content_top: '',
      content_bottom: '',
      attributes: null,
      modifier_class: '',
      ...selectedFilters,
    };
  },
};
