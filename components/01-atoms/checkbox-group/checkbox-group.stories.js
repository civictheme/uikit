import CivicThemeCheckboxGroup from './checkbox-group.twig';
import { knobText, knobBoolean, knobNumber, knobRadios, shouldRender, randomFields } from '../../00-base/base.utils';

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
    items: randomFields(knobNumber(
      'Items count',
      5,
      {
        range: true,
        min: 0,
        max: 10,
        step: 1,
      },
      parentKnobs.knobTab,
    ), parentKnobs.theme, false, 'checkbox'),
    name: knobText('Name', 'checkbox-name', parentKnobs.name, parentKnobs.knobTab),
    content: knobText('Content', 'Checkbox label', parentKnobs.content, parentKnobs.knobTab),
    is_disabled: knobBoolean('Disabled', false, parentKnobs.is_disabled, parentKnobs.knobTab),
    is_invalid: knobBoolean('Has error', false, parentKnobs.is_invalid, parentKnobs.knobTab),
    for: knobText('For', 'checkbox-element', parentKnobs.for, parentKnobs.knobTab),
    modifier_class: `story-wrapper-size--small ${knobText('Additional class', '', parentKnobs.knobTab)}`,
    attributes: knobText('Additional attributes', '', parentKnobs.attributes, parentKnobs.knobTab),
  };

  return shouldRender(parentKnobs) ? CivicThemeCheckboxGroup(knobs) : knobs;
};
