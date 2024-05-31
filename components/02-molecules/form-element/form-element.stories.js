import CivicThemeFormElement from './form-element.twig';
import Input from '../../01-atoms/input/input.twig';
import Select from '../../01-atoms/select/select.twig';
import { knobBoolean, knobRadios, knobText, randomName, shouldRender } from '../../00-base/base.utils';
import { Radio } from '../../01-atoms/radio/radio.stories';
import { Checkbox } from '../../01-atoms/checkbox/checkbox.stories';

export default {
  title: 'Molecules/Form Element',
};

export const FormElement = (props = {}) => {
  const inputKnobTab = 'Input';

  const theme = knobRadios(
    'Theme',
    {
      Light: 'light',
      Dark: 'dark',
    },
    'light',
    props.knobTab,
  );

  const inputType = knobRadios(
    'Type',
    {
      Text: 'text',
      Textarea: 'textarea',
      Email: 'email',
      Tel: 'tel',
      Password: 'password',
      Select: 'select',
      Radio: 'radio',
      Checkbox: 'checkbox',
    },
    'text',
    props.knobTab,
  );

  const knobs = {
    theme,
    label: knobText('Label', 'Label for input', props.knobTab),
    label_display: knobRadios(
      'Label display',
      {
        Before: 'before',
        After: 'after',
        Invisible: 'invisible',
      },
      'before',
      props.knobTab,
    ),
    description: knobText('Description', 'Example input description', props.knobTab),
    description_display: knobRadios(
      'Description display',
      {
        Before: 'before',
        After: 'after',
        Invisible: 'invisible',
      },
      'after',
      props.knobTab,
    ),
    errors: knobBoolean('With error', false, props.knobTab) ? 'Sample error message' : false,
    is_required: knobBoolean('Required', false, props.knobTab),
    modifier_class: knobText('Additional class', '', props.knobTab),
    attributes: knobText('Additional attributes', '', props.knobTab),
  };

  const states = {
    None: 'default',
    Error: 'error',
    Success: 'success',
  };

  const inputKnobs = {
    theme,
    value: knobText('Value', 'Form element value', null, inputKnobTab),
    placeholder: knobText('Placeholder', 'Form element placeholder', null, inputKnobTab),
    state: knobRadios(
      'State',
      states,
      'default',
      null,
      inputKnobTab,
    ),
    disabled: knobBoolean('Disabled', false, null, inputKnobTab),
    is_required: knobs.is_required,
  };

  const selectKnobs = {
    theme,
    state: knobRadios(
      'State',
      states,
      'default',
      null,
      inputKnobTab,
    ),
    disabled: knobBoolean('Disabled', false, null, inputKnobTab),
    options: [
      { type: 'option', value: 'option1', label: 'Option 1' },
      { type: 'option', value: 'option2', label: 'Option 2' },
      { type: 'option', value: 'option3', label: 'Option 3' },
      { type: 'option', value: 'option4', label: 'Option 4' },
    ],
  };

  const radioKnobs = {
    theme,
    state: knobRadios(
      'State',
      states,
      'default',
      null,
      inputKnobTab,
    ),
    disabled: knobBoolean('Disabled', false, null, inputKnobTab),
    is_required: knobs.is_required,
  };

  const checkboxKnobs = {
    theme,
    state: knobRadios(
      'State',
      states,
      'default',
      null,
      inputKnobTab,
    ),
    disabled: knobBoolean('Disabled', false, null, inputKnobTab),
    is_required: knobs.is_required,
  };

  const children = [];

  switch (inputType) {
    case 'radio':
      children.push(Radio({
        type: inputType,
        ...radioKnobs,
      }));
      break;

    case 'checkbox':
      children.push(Checkbox({
        type: inputType,
        ...checkboxKnobs,
      }));
      break;

    case 'select':
      children.push(Select({
        ...selectKnobs,
      }));
      break;

    default:
      children.push(Input({
        type: inputType,
        ...inputKnobs,
      }));
  }

  knobs.id = randomName(5);

  const combinedKnobs = { ...knobs, type: inputType, children };

  return shouldRender(props)
    ? `<div class="container"><div class="row"><div class="col-xxs-12">${CivicThemeFormElement(combinedKnobs)}</div></div></div>`
    : combinedKnobs;
};
