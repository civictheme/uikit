import CivicThemeRadio from './radio.twig';
import { knobBoolean, knobText, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Atoms/Radio',
  parameters: {
    layout: 'centered',
  },
};

export const Radio = (parentKnobs = {}) => {
  const knobs = {
    theme: knobBoolean(
      'Theme',
      {
        Light: 'light',
        Dark: 'dark',
      },
      'light',
      parentKnobs.theme,
      parentKnobs.knobTab,
    ),
    content: knobText('Content', 'Radio label', parentKnobs.content, parentKnobs.knobTab),
    is_required: knobBoolean('Required', false, parentKnobs.is_required, parentKnobs.knobTab),
    for: knobText('For', 'radio-element', parentKnobs.for, parentKnobs.knobTab),
    is_disabled: knobBoolean('Disabled', false, parentKnobs.is_disabled, parentKnobs.knobTab),
    has_error: knobBoolean('Has error', false, parentKnobs.has_error, parentKnobs.knobTab),
    attributes: knobText('Additional attributes', '', parentKnobs.attributes, parentKnobs.knobTab),
    modifier_class: knobText('Additional classes', '', parentKnobs.modifier_class, parentKnobs.knobTab),
  };

  return shouldRender(parentKnobs) ? CivicThemeRadio(knobs) : knobs;
};
