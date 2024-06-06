import CivicThemeSelect from './select.twig';
import { generateSelectOptions, knobBoolean, knobRadios, knobText, randomInt, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Atoms/Select',
  parameters: {
    layout: 'centered',
    wrapperSize: 'small',
    wrapperIsContainer: true,
    wrapperIsResizable: true,
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
      parentKnobs.theme,
      parentKnobs.knobTab,
    ),
    is_multiple: knobBoolean('Is multiple', false, parentKnobs.is_multiple, parentKnobs.knobTab),
    options: knobBoolean('With options', true, parentKnobs.options, parentKnobs.knobTab) ? generateSelectOptions(randomInt(3, 5), (knobBoolean('Options have groups', false, null, parentKnobs.knobTab) ? 'optgroup' : 'option')) : [],
    is_required: knobBoolean('Required', false, parentKnobs.is_required, parentKnobs.knobTab),
    is_disabled: knobBoolean('Disabled', false, parentKnobs.is_disabled, parentKnobs.knobTab),
    has_error: knobBoolean('Has error', false, parentKnobs.has_error, parentKnobs.knobTab),
    for: knobText('For', '', parentKnobs.for, parentKnobs.knobTab),
    attributes: knobText('Additional attributes', '', parentKnobs.attributes, parentKnobs.knobTab),
    modifier_class: knobText('Additional classes', '', parentKnobs.modifier_class, parentKnobs.knobTab),
  };

  return shouldRender(parentKnobs) ? CivicThemeSelect(knobs) : knobs;
};
