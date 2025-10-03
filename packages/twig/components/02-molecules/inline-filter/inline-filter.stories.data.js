import Field from '../field/field.twig';
import FieldData from '../field/field.stories.data';

export default {
  args: (theme = 'light') => ({
    theme,
    title: 'Search',
    items: [
      Field({
        ...FieldData.args(theme),
        title: 'Search keywords',
        placeholder: 'I’m looking for...',
        description: null,
        message: null,
        orientation: 'vertical',
      }),
    ].join('').trim(),
    submit_text: 'Search',
    items_end: '',
    attributes: '',
    modifier_class: '',
  }),
};
