import CivicThemeCheckbox from './checkbox.twig';
import { knobBoolean, knobRadios, knobText, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Atoms/Checkbox',
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
    content: knobText('Content', 'Checkbox label', parentKnobs.knobTab),
    is_required: knobBoolean('Required', false, parentKnobs.knobTab),
    disabled: knobBoolean('Disabled', false, parentKnobs.knobTab),
    has_error: knobBoolean('Has error', false, parentKnobs.knobTab),
    modifier_class: knobText('Additional classes', '', parentKnobs.knobTab),
    attributes: knobText('Additional attributes', '', parentKnobs.knobTab),
  };

  return shouldRender(parentKnobs) ? CivicThemeCheckbox(knobs) : knobs;
};
