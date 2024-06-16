import { generateItems, knobBoolean, knobNumber, knobRadios, knobText, KnobValues, randomName, shouldRender } from '../../00-base/storybook/storybook.utils';
import CivicThemeField from './field.twig';
import { Select } from '../../01-atoms/select/select.stories';
import { Textfield } from '../../01-atoms/textfield/textfield.stories';
import { Textarea } from '../../01-atoms/textarea/textarea.stories';
import { Radio } from '../../01-atoms/radio/radio.stories';
import { Checkbox } from '../../01-atoms/checkbox/checkbox.stories';

export default {
  title: 'Molecules/Field',
  parameters: {
    layout: 'centered',
    storyLayoutSize: 'medium',
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
        Radios: 'radios',
        Checkboxes: 'checkboxes',
        Hidden: 'hidden',
        Other: 'other',
      },
      'textfield',
      parentKnobs.type,
      parentKnobs.knobTab,
    ),
    label: knobText('Label', 'Field label', parentKnobs.label, parentKnobs.knobTab),
    description: knobText('Description', 'Description content sample with long text that spans on the multiple lines to test text vertical spacing', parentKnobs.description, parentKnobs.knobTab),
    message: knobText('Message', 'Message content sample with long text that spans on the multiple lines to test text vertical spacing', parentKnobs.message, parentKnobs.knobTab),
    is_required: knobBoolean('Required', false, parentKnobs.is_required, parentKnobs.knobTab),
    is_invalid: knobBoolean('Has error', false, parentKnobs.is_invalid, parentKnobs.knobTab),
    is_disabled: knobBoolean('Disabled', false, parentKnobs.is_disabled, parentKnobs.knobTab),
    orientation: knobRadios(
      'Orientation',
      {
        Horizontal: 'horizontal',
        Vertical: 'vertical',
      },
      'vertical',
      parentKnobs.orientation,
      parentKnobs.knobTab,
    ),
    is_inline: knobBoolean('Inline (for group controls)', false, parentKnobs.is_inline, parentKnobs.knobTab),
    modifier_class: knobText('Additional class', '', parentKnobs.modifier_class, parentKnobs.knobTab),
    attributes: knobText('Additional attributes', '', parentKnobs.attributes, parentKnobs.knobTab),
  };

  let controlKnobs = {};
  const name = randomName();
  switch (knobs.type) {
    case 'textfield':
      controlKnobs = Textfield(new KnobValues({ theme: knobs.theme }, false));
      break;

    case 'textarea':
      controlKnobs = Textarea(new KnobValues({ theme: knobs.theme }, false));
      break;

    case 'select':
      controlKnobs = Select(new KnobValues({ theme: knobs.theme }, false));
      break;

    case 'radios':
      controlKnobs.control = generateItems(knobNumber(
        'Items count',
        5,
        {
          range: true,
          min: 0,
          max: 10,
          step: 1,
        },
        parentKnobs.items_count,
        parentKnobs.knobTab,
      ), (idx) => ({
        ...Radio(new KnobValues({ theme: knobs.theme }, false)),
        ...{
          id: idx,
          // All radios in a group should have the same name.
          name,
        },
      }));
      break;

    case 'checkboxes':
      controlKnobs.control = generateItems(knobNumber(
        'Items count',
        5,
        {
          range: true,
          min: 0,
          max: 10,
          step: 1,
        },
        parentKnobs.items_count,
        parentKnobs.knobTab,
      ), (idx) => ({
        ...Checkbox(new KnobValues({ theme: knobs.theme }, false)),
        ...{
          id: idx,
        },
      }));
      break;

    default:
      controlKnobs = {};
  }

  // Merge and override knob values from controls with the values taken from
  // the knobs of this story.
  const combinedKnobs = { ...controlKnobs, ...knobs };

  return shouldRender(parentKnobs) ? CivicThemeField(combinedKnobs) : combinedKnobs;
};
