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

export const Field = (parentKnobs = {}) => {
  const knobs = {
    theme: knobRadios(
      'Theme',
      {
        Light: 'light',
        Dark: 'dark',
      },
      'light',
      parentKnobs.theme,
      parentKnobs.knobTab,
    ),
    type: knobRadios(
      'Type',
      {
        Textfield: 'textfield',
        Textarea: 'textarea',
        Select: 'select',
        Checkbox: 'checkbox',
        Hidden: 'hidden',
        Other: 'other',
      },
      'textfield',
      parentKnobs.type,
      parentKnobs.knobTab,
    ),
    direction: knobRadios(
      'Direction',
      {
        Horizontal: 'horizontal',
        Vertical: 'vertical',
      },
      'vertical',
      parentKnobs.direction,
      parentKnobs.knobTab,
    ),
    control_direction: knobRadios(
      'Control direction (for group controls)',
      {
        Horizontal: 'horizontal',
        Vertical: 'vertical',
      },
      'vertical',
      parentKnobs.control_direction,
      parentKnobs.knobTab,
    ),
    label: knobText('Label', 'Field label', parentKnobs.label, parentKnobs.knobTab),
    description: knobText('Description', 'Content sample with long text that spans on the multiple lines to test text vertical spacing', parentKnobs.description, parentKnobs.knobTab),
    is_required: knobBoolean('Required', false, parentKnobs.is_required, parentKnobs.knobTab),
    is_disabled: knobBoolean('Disabled', false, parentKnobs.is_disabled, parentKnobs.knobTab),
    is_invalid: knobBoolean('Invalid', false, parentKnobs.is_invalid, parentKnobs.knobTab),
    message: knobText('Message', 'Content sample with long text that spans on the multiple lines to test text vertical spacing', parentKnobs.message, parentKnobs.knobTab),
    modifier_class: `story-wrapper-size--medium ${knobText('Additional class', '', parentKnobs.modifier_class, parentKnobs.knobTab)}`,
    attributes: knobText('Additional attributes', '', parentKnobs.attributes, parentKnobs.knobTab),
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

  return shouldRender(parentKnobs) ? CivicThemeField(knobs) : knobs;
};
