import CivicThemeCheckbox from './checkbox.twig';
import { knobText, knobBoolean, knobRadios, shouldRender } from '../../00-base/base.utils';

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
      parentKnobs.theme,
      parentKnobs.knobTab,
    ),
    content: knobText('Content', 'Checkbox label', parentKnobs.content, parentKnobs.knobTab),
    is_required: knobBoolean('Required', false, parentKnobs.is_required, parentKnobs.knobTab),
    for: knobText('For', '', parentKnobs.for, parentKnobs.knobTab),
    is_disabled: knobBoolean('Disabled', false, parentKnobs.is_disabled, parentKnobs.knobTab),
    has_error: knobBoolean('Has error', false, parentKnobs.has_error, parentKnobs.knobTab),
    attributes: knobText('Additional attributes', '', parentKnobs.attributes, parentKnobs.knobTab),
    modifier_class: knobText('Additional classes', '', parentKnobs.modifier_class, parentKnobs.knobTab),
  };

  return shouldRender(parentKnobs) ? CivicThemeCheckbox(knobs) : knobs;
};
