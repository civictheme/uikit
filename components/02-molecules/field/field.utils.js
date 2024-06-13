import { KnobValues, randomArrayItem } from '../../00-base/base.utils';
import { Field } from './field.stories';

export const randomFields = (count, theme, rand, defaultInputType) => {
  rand = rand || false;

  const inputTypes = [
    'textfield',
    'textarea',
    'select',
    'radios',
    'checkboxes',
  ];

  const fields = [];
  for (let i = 0; i < count; i++) {
    const inputType = defaultInputType || randomArrayItem(inputTypes);
    fields.push(Field(new KnobValues({
      type: inputType,
      message: null,
    })));
  }

  return fields;
};
