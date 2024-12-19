export default {
  args: (theme = 'light', options = {}) => {
    const name = `option_group_${Math.floor(Math.random() * 1000)}`;
    const control = options.controls ? [1, 2, 3].map((i) => ({
      label: `Control item ${i}`,
      name,
      value: '',
      id: `control_item_${i}`,
      is_required: false,
      is_invalid: false,
      is_disabled: false,
      attributes: '',
      modifier_class: '',
    })) : null;

    const selectOptions = options.options ? [1, 2, 3].map((i) => ({
      type: 'option',
      label: `Option ${i}`,
      value: `option_${i}`,
      selected: false,
    })) : null;

    return {
      theme,
      type: 'textfield',
      title: 'Field title',
      title_display: 'visible',
      description: 'Description content sample.',
      message: 'Message content sample.',
      is_required: false,
      is_invalid: false,
      is_disabled: false,
      orientation: 'vertical',
      is_inline: false,
      name,
      value: '',
      placeholder: 'Field placeholder',
      id: 'field_id',
      control,
      options: selectOptions,
      attributes: '',
      modifier_class: '',
      prefix: '',
      suffix: '',
    };
  },
};
