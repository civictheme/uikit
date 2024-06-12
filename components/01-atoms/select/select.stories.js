import CivicThemeSelect from './select.twig';
import { generateSelectOptions, knobBoolean, knobRadios, knobText, randomName, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Atoms/Form Controls/Select',
  parameters: {
    layout: 'centered',
    wrapperIsContainer: true,
    wrapperSize: 'medium',
  },
};

export const Select = (parentKnobs = {}) => {
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
    is_multiple: knobBoolean('Is multiple', false, parentKnobs.is_multiple, parentKnobs.knobTab),
    options: knobBoolean('With options', true, parentKnobs.options, parentKnobs.knobTab) ? generateSelectOptions(10, (knobBoolean('Options have groups', false, null, parentKnobs.knobTab) ? 'optgroup' : 'option')) : [],
    name: randomName(),
    is_required: knobBoolean('Required', false, parentKnobs.knobTab),
    is_disabled: knobBoolean('Disabled', false, parentKnobs.knobTab),
    is_invalid: knobBoolean('Has error', false, parentKnobs.knobTab),
    modifier_class: knobText('Additional classes', '', parentKnobs.knobTab),
    attributes: knobText('Additional attributes', '', parentKnobs.knobTab),
  };

  return shouldRender(parentKnobs) ? CivicThemeSelect(knobs) : knobs;
};
