import CivicThemeCheckbox from './checkbox.twig';
import { knobBoolean, knobRadios, knobText, randomId, randomInt, randomName, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Atoms/Form Controls/Checkbox',
  parameters: {
    layout: 'centered',
  },
};

export const Checkbox = (parentKnobs = {}) => {
  const knobs = {
    theme: knobRadios(
      'Theme',
      {
        Light: 'light',
        Dark: 'dark',
      },
      'light',
      parentKnobs.knobTab,
    ),
    label: knobText('Label', 'Checkbox label', parentKnobs.knobTab),
    name: randomName(),
    id: randomId(),
    value: randomInt(1, 1000),
    is_required: knobBoolean('Required', false, parentKnobs.knobTab),
    is_disabled: knobBoolean('Disabled', false, parentKnobs.knobTab),
    is_invalid: knobBoolean('Has error', false, parentKnobs.knobTab),
    attributes: knobText('Additional attributes', '', parentKnobs.knobTab),
    modifier_class: knobText('Additional classes', '', parentKnobs.knobTab),
  };

  return shouldRender(parentKnobs) ? CivicThemeCheckbox(knobs) : knobs;
};
