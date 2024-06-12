import CivicThemeRadioGroup from './radio-group.twig';
import { knobText, knobBoolean, knobNumber, knobRadios, shouldRender, randomFields } from '../../00-base/base.utils';

export default {
  title: 'Atoms/Form Controls/Radio Group',
  parameters: {
    layout: 'centered',
  },
};

export const RadioGroup = (parentKnobs = {}) => {
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
    direction: knobRadios(
      'Direction',
      {
        Horizontal: 'horizontal',
        Vertical: 'vertical',
      },
      'vertical',
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
    ), parentKnobs.theme, false, 'radio'),
    name: knobText('Name', 'radio-name', parentKnobs.name, parentKnobs.knobTab),
    content: knobText('Content', 'Radio label', parentKnobs.knobTab),
    is_disabled: knobBoolean('Disabled', false, parentKnobs.knobTab),
    has_error: knobBoolean('Has error', false, parentKnobs.knobTab),
    for: knobText('For', '', parentKnobs.knobTab),
    modifier_class: `story-wrapper-size--small ${knobText('Additional class', '', parentKnobs.knobTab)}`,
    attributes: knobText('Additional attributes', '', parentKnobs.knobTab),
  };

  return shouldRender(parentKnobs) ? CivicThemeRadioGroup(knobs) : knobs;
};
