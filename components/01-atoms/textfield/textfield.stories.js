import CivicThemeTextfield from './textfield.twig';
import { knobBoolean, knobRadios, knobText, randomName, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Atoms/Form Controls/Textfield',
  parameters: {
    layout: 'centered',
    wrapperIsContainer: true,
    wrapperSize: 'medium',
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
    value: knobText('Value', '', parentKnobs.knobTab),
    name: randomName(),
    is_required: knobBoolean('Required', false, parentKnobs.knobTab),
    is_disabled: knobBoolean('Disabled', false, parentKnobs.knobTab),
    is_invalid: knobBoolean('Has error', false, parentKnobs.knobTab),
    modifier_class: knobText('Additional classes', '', parentKnobs.knobTab),
    attributes: knobText('Additional attributes', '', parentKnobs.knobTab),
  };

  return shouldRender(parentKnobs) ? CivicThemeTextfield(knobs) : knobs;
};
