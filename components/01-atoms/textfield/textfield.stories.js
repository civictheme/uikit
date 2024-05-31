import CivicThemeTextfield from './textfield.twig';
import { knobBoolean, knobRadios, knobText, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Atoms/Textfield',
  parameters: {
    layout: 'centered',
  },
};

export const Textfield = (props = {}) => {
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
    placeholder: knobText('Placeholder', 'Placeholder', props.knobTab),
    is_required: knobBoolean('Required', false, props.knobTab),
    disabled: knobBoolean('Disabled', false, props.knobTab),
    for: knobText('For', '', props.knobTab),
    modifier_class: knobText('Additional classes', '', props.knobTab),
    attributes: knobText('Additional attributes', '', props.knobTab),
  };

  return shouldRender(props) ? CivicThemeTextfield(knobs) : knobs;
};
