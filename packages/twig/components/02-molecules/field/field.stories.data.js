import Textfield from '../../01-atoms/textfield/textfield.twig';
import Textarea from '../../01-atoms/textarea/textarea.twig';
import Select from '../../01-atoms/select/select.twig';
import Checkbox from '../../01-atoms/checkbox/checkbox.twig';
import Radio from '../../01-atoms/radio/radio.twig';
import Input from '../../01-atoms/input/input.twig';
import ItemList from '../../00-base/item-list/item-list.twig';

const selectOptions = [1, 2, 3].map((i) => ({
  type: 'option',
  label: `Option ${i}`,
  value: `option_${i}`,
  selected: false,
}));

const children = (args) => {
  const {
    theme = 'light', type = 'textfield', name, id, value = '', placeholder = '', is_required = false, is_invalid = false, is_disabled = false,
  } = args;
  const common = {
    theme, name, id, value, placeholder, is_required, is_invalid, is_disabled,
  };

  switch (type) {
    case 'textfield':
      return Textfield(common);

    case 'textarea':
      return Textarea({ ...common, rows: 5 });

    case 'select':
    case 'select_multiple':
      return Select({ ...common, options: selectOptions, is_multiple: type === 'select_multiple' });

    case 'checkbox':
    case 'radio': {
      const Item = type === 'checkbox' ? Checkbox : Radio;
      const items = [1, 2, 3].map((i) => Item({
        ...common,
        label: `Control item ${i}`,
        id: `${id}_control_item_${i}`,
        value: `option_${i}`,
      }));
      return ItemList({ direction: 'vertical', items });
    }

    case 'hidden':
      return Input({ ...common, type: 'hidden' });

    default:
      return Input({ ...common, type });
  }
};

export default {
  children,
  args: (theme = 'light', options = {}) => {
    const fieldId = `field_id_${Math.floor(Math.random() * 1000)}`;
    return {
      theme,
      type: 'textfield',
      is_group: false,
      title: 'Field title',
      title_display: 'visible',
      title_size: 'regular',
      description: 'Description content sample.',
      message: {
        content: 'Message content sample.',
        attributes: `id="${fieldId}--error-message"`,
      },
      is_required: options.is_required || false,
      required_text: '',
      is_invalid: false,
      is_disabled: false,
      orientation: 'vertical',
      name: `option_group_${Math.floor(Math.random() * 1000)}`,
      value: '',
      placeholder: 'Field placeholder',
      id: fieldId,
      attributes: null,
      modifier_class: '',
      prefix: '',
      suffix: '',
    };
  },
};
