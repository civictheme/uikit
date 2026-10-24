import Field from '../field/field.twig';
import FieldData from '../field/field.stories.data';

// The control markup is built from the atoms and passed into the field
// component's `control` slot.
const field = (args) => Field({ ...args, control: FieldData.control(args) });

export default {
  args: (theme = 'light') => ({
    theme,
    title: 'Search',
    items: [
      field({
        ...FieldData.args(theme),
        title: 'Search keywords',
        title_size: 'extra-large',
        placeholder: 'I’m looking for...',
        description: null,
        message: null,
        orientation: 'vertical',
      }),
    ].join('').trim(),
    submit_text: 'Search',
    items_end: '',
    attributes: null,
    modifier_class: '',
  }),
};
