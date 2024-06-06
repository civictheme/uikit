import CivicThemeTextfield from './textfield.twig';
import { knobBoolean, knobRadios, knobText, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Atoms/Textfield',
  parameters: {
    layout: 'centered',
  },
};

export const Textfield = (parentKnobs = {}) => {
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
    placeholder: knobText('Placeholder', 'Placeholder', parentKnobs.knobTab),
    is_required: knobBoolean('Required', false, parentKnobs.knobTab),
    disabled: knobBoolean('Disabled', false, parentKnobs.knobTab),
    for: knobText('For', '', parentKnobs.knobTab),
    modifier_class: knobText('Additional classes', '', parentKnobs.knobTab),
    attributes: knobText('Additional attributes', '', parentKnobs.knobTab),
  };

  return shouldRender(parentKnobs) ? CivicThemeTextfield(knobs) : knobs;
};
