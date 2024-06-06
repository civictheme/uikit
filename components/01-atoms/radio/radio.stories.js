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
      parentKnobs.knobTab,
    ),
    content: knobText('Content', 'Radio label', parentKnobs.knobTab),
    is_required: knobBoolean('Required', false, parentKnobs.knobTab),
    disabled: knobBoolean('Disabled', false, parentKnobs.knobTab),
    has_error: knobBoolean('Has error', false, parentKnobs.knobTab),
    attributes: knobText('Additional attributes', '', parentKnobs.knobTab),
    modifier_class: knobText('Additional classes', '', parentKnobs.knobTab),
  };

  return shouldRender(parentKnobs) ? CivicThemeRadio(knobs) : knobs;
};
