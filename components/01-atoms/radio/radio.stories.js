import CivicThemeRadio from './radio.twig';
import { knobBoolean, knobText, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Atoms/Radio',
  parameters: {
    layout: 'centered',
  },
};

export const Radio = (props = {}) => {
  const knobs = {
    theme: knobBoolean(
      'Theme',
      {
        Light: 'light',
        Dark: 'dark',
      },
      'light',
      props.knobTab,
    ),
    content: knobText('Content', 'Radio label', props.knobTab),
    is_required: knobBoolean('Required', false, props.knobTab),
    for: knobText('For', '', props.knobTab),
    is_disabled: knobBoolean('Disabled', false, props.knobTab),
    has_error: knobBoolean('Has error', false, props.knobTab),
    attributes: knobText('Additional attributes', '', props.knobTab),
    modifier_class: knobText('Additional classes', '', props.knobTab),
  };

  return shouldRender(props) ? CivicThemeRadio(knobs) : knobs;
};
