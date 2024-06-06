import { knobBoolean, knobRadios, knobText, shouldRender } from '../../00-base/base.utils';
import CivicThemeField from './field.twig';
import { Select } from '../../01-atoms/select/select.stories';
import { Textfield } from '../../01-atoms/textfield/textfield.stories';
import { Textarea } from '../../01-atoms/textarea/textarea.stories';
import { Checkbox } from '../../01-atoms/checkbox/checkbox.stories';

export default {
  title: 'Molecules/Field',
  parameters: {
    layout: 'centered',
  },
};

export const Field = (props = {}) => {
  const knobs = {
    theme: knobRadios(
      'Theme',
      {
        Light: 'light',
        Dark: 'dark',
      },
      'light',
      props.theme,
      props.knobTab,
    ),
    type: knobRadios(
      'Type',
      {
        Textfield: 'textfield',
        Textarea: 'textarea',
        Select: 'select',
        Radio: 'radio',
        Checkbox: 'checkbox',
        Hidden: 'hidden',
        Other: 'other',
      },
      'textfield',
      props.type,
      props.knobTab,
    ),
    direction: knobRadios(
      'Direction',
      {
        Horizontal: 'horizontal',
        Vertical: 'vertical',
      },
      'vertical',
      props.direction,
      props.knobTab,
    ),
    control_direction: knobRadios(
      'Control direction (for group controls)',
      {
        Horizontal: 'horizontal',
        Vertical: 'vertical',
      },
      'vertical',
      props.control_direction,
      props.knobTab,
    ),
    label: knobText('Label', 'Field label', props.label, props.knobTab),
    description: knobText('Description', 'Content sample with long text that spans on the multiple lines to test text vertical spacing', props.description, props.knobTab),
    is_required: knobBoolean('Required', false, props.is_required, props.knobTab),
    is_disabled: knobBoolean('Disabled', false, props.is_disabled, props.knobTab),
    is_invalid: knobBoolean('Invalid', false, props.is_invalid, props.knobTab),
    message: knobText('Message', 'Content sample with long text that spans on the multiple lines to test text vertical spacing', props.message, props.knobTab),
    modifier_class: `story-wrapper-size--medium ${knobText('Additional class', '', props.modifier_class, props.knobTab)}`,
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
  };

  switch (knobs.type) {
    case 'textfield':
      knobs.control = Textfield(knobs);
      break;

    case 'textarea':
      knobs.control = Textarea(knobs);
      break;

    case 'select':
      knobs.control = Select(knobs);
      break;

    case 'checkbox':
      knobs.control = Checkbox(knobs);
      break;

    default:
      knobs.control = Textfield(knobs);
  }

  return shouldRender(props) ? CivicThemeField(knobs) : knobs;
};
