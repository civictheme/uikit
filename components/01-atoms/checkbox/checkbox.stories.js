import CivicThemeCheckbox from './checkbox.twig';
import { knobText, knobBoolean, knobRadios, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Atoms/Checkbox',
  parameters: {
    layout: 'centered',
  },
};

export const Checkbox = (props = {}) => {
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
    content: knobText('Content', 'Checkbox label', props.knobTab),
    is_required: knobBoolean('Required', false, props.knobTab),
    for: knobText('For', '', props.knobTab),
    disabled: knobBoolean('Disabled', false, props.knobTab),
    has_error: knobBoolean('Has error', false, props.knobTab),
    modifier_class: knobText('Additional classes', '', props.knobTab),
    attributes: knobText('Additional attributes', '', props.knobTab),
  };

  return shouldRender(props) ? CivicThemeCheckbox(knobs) : knobs;
};
