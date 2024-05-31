import CivicThemeSelect from './select.twig';
import { generateOptions, knobBoolean, knobRadios, knobText, randomInt, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Atoms/Select',
  parameters: {
    layout: 'centered',
  },
};

export const Select = (props = {}) => {
  const knobs = {
    theme: knobRadios(
      'Theme',
      {
        Light: 'light',
        Dark: 'dark',
      },
      'light',
      props.knobTab,
    ),
    is_multiple: knobBoolean('Is multiple', false, props.knobTab),
    options: knobBoolean('With options', true, props.knobTab) ? generateOptions(randomInt(3, 5), (knobBoolean('Options have groups', false, props.knobTab) ? 'optgroup' : 'option')) : [],
    is_required: knobBoolean('Required', false, props.knobTab),
    disabled: knobBoolean('Disabled', false, props.knobTab),
    has_error: knobBoolean('Has error', false, props.knobTab),
    for: knobText('For', '', props.knobTab),
    attributes: knobText('Additional attributes', '', props.knobTab),
    modifier_class: knobText('Additional classes', '', props.knobTab),
  };

  return shouldRender(props) ? CivicThemeSelect(knobs) : knobs;
};
