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
      props.theme,
      props.knobTab,
    ),
    content: knobText('Content', 'Radio label', props.content, props.knobTab),
    is_required: knobBoolean('Required', false, props.is_required, props.knobTab),
    for: knobText('For', '', props.for, props.knobTab),
    is_disabled: knobBoolean('Disabled', false, props.is_disabled, props.knobTab),
    has_error: knobBoolean('Has error', false, props.has_error, props.knobTab),
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
    modifier_class: knobText('Additional classes', '', props.modifier_class, props.knobTab),
  };

  return shouldRender(props) ? CivicThemeRadio(knobs) : knobs;
};
