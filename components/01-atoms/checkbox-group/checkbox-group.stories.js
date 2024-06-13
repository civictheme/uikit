import CivicThemeCheckboxGroup from './checkbox-group.twig';
import { knobText, knobBoolean, knobNumber, knobRadios, shouldRender, randomFields, randomId } from '../../00-base/base.utils';

export default {
  title: 'Atoms/Form Controls/Checkbox Group',
  parameters: {
    layout: 'centered',
  },
};

export const CheckboxGroup = (parentKnobs = {}) => {
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
    is_inline: knobBoolean(
      'Is inline',
      false,
      parentKnobs.is_inline,
      parentKnobs.knobTab,
    ),
    items: randomFields(knobNumber(
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
    ), parentKnobs.theme, false, 'checkbox'),
    label: knobText('Content', 'Checkbox label', parentKnobs.label, parentKnobs.knobTab),
    name: knobText('Name', 'checkbox-name', parentKnobs.name, parentKnobs.knobTab),
    id: randomId(),
    is_required: knobBoolean('Required', false, parentKnobs.knobTab),
    is_disabled: knobBoolean('Disabled', false, parentKnobs.is_disabled, parentKnobs.knobTab),
    is_invalid: knobBoolean('Has error', false, parentKnobs.is_invalid, parentKnobs.knobTab),
    modifier_class: knobText('Additional class', '', parentKnobs.modifier_class, parentKnobs.knobTab),
    attributes: knobText('Additional attributes', '', parentKnobs.attributes, parentKnobs.knobTab),
  };

  return shouldRender(parentKnobs) ? CivicThemeCheckboxGroup(knobs) : knobs;
};
