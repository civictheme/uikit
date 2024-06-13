import { knobBoolean, knobRadios, knobText, KnobValues, shouldRender } from '../../00-base/base.utils';
import CivicThemeField from './field.twig';
import { Select } from '../../01-atoms/select/select.stories';
import { Textfield } from '../../01-atoms/textfield/textfield.stories';
import { Textarea } from '../../01-atoms/textarea/textarea.stories';
import { Checkbox } from '../../01-atoms/checkbox/checkbox.stories';
import { CheckboxGroup } from '../../01-atoms/checkbox-group/checkbox-group.stories';
import { Radio } from '../../01-atoms/radio/radio.stories';
import { RadioGroup } from '../../01-atoms/radio-group/radio-group.stories';

export default {
  title: 'Molecules/Field',
  parameters: {
    layout: 'centered',
    wrapperIsContainer: true,
    wrapperSize: 'medium',
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
      parentKnobs.knobTab
    ),
    type: knobRadios(
      'Type',
      {
        Textfield: 'textfield',
        Textarea: 'textarea',
        Select: 'select',
        Radio: 'radio',
        'Radio Group': 'radio-group',
        Checkbox: 'checkbox',
        'Checkbox Group': 'checkbox-group',
        Hidden: 'hidden',
        Other: 'other',
      },
      'textfield',
      parentKnobs.type,
      parentKnobs.knobTab
    ),
    orientation: knobRadios(
      'Orientation',
      {
        Horizontal: 'horizontal',
        Vertical: 'vertical',
      },
      'vertical',
      parentKnobs.orientation,
      parentKnobs.knobTab
    ),
    control_orientation: knobRadios(
      'Control orientation (for group controls)',
      {
        Horizontal: 'horizontal',
        Vertical: 'vertical',
      },
      'vertical',
      parentKnobs.control_orientation,
      parentKnobs.knobTab
    ),
    label: knobText('Label', 'Field label', parentKnobs.label, parentKnobs.knobTab,),
    description: knobText('Description', 'Content sample with long text that spans on the multiple lines to test text vertical spacing', parentKnobs.description, parentKnobs.knobTab,),
    is_required: knobBoolean('Required', false, parentKnobs.is_required, parentKnobs.knobTab,),
    is_disabled: knobBoolean('Disabled', false, parentKnobs.is_disabled, parentKnobs.knobTab,),
    is_invalid: knobBoolean('Has error', false, parentKnobs.is_invalid, parentKnobs.knobTab,),
    message: knobText('Message', 'Content sample with long text that spans on the multiple lines to test text vertical spacing', parentKnobs.message, parentKnobs.knobTab,),
    modifier_class: knobText('Additional class', '', parentKnobs.modifier_class, parentKnobs.knobTab,),
    attributes: knobText('Additional attributes', '', parentKnobs.attributes, parentKnobs.knobTab,),
  };

  switch (knobs.type) {
    case 'textfield':
      knobs.control = Textfield(new KnobValues({}, false));
      break;

    case 'textarea':
      knobs.control = Textarea(new KnobValues({}, false));
      break;

    case 'select':
      knobs.control = Select(new KnobValues({}, false));
      break;

    case 'checkbox-group':
      knobs.control = CheckboxGroup(new KnobValues({}, false));
      break;

    case 'radio-group':
      knobs.control = RadioGroup(new KnobValues({}, false));
      break;

    default:
      knobs.control = {};
  }

  return shouldRender(parentKnobs) ? CivicThemeField(knobs) : knobs;
};
