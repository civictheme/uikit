import CivicThemeTextarea from './textarea.twig';
import { knobBoolean, knobNumber, knobRadios, knobText, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Atoms/Textarea',
  parameters: {
    layout: 'centered',
  },
};

export const Textarea = (props = {}) => {
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
    rows: knobNumber(
      'Number of rows',
      5,
      {
        range: true,
        min: 1,
        max: 10,
        step: 1,
      },
      props.knobTab,
    ),
    placeholder: knobText('Placeholder', 'Placeholder', props.knobTab),
    is_required: knobBoolean('Required', false, props.knobTab),
    disabled: knobBoolean('Disabled', false, props.knobTab),
    for: knobText('For', '', props.knobTab),
    modifier_class: knobText('Additional classes', '', props.knobTab),
    attributes: knobText('Additional attributes', '', props.knobTab),
  };

  return shouldRender(props) ? CivicThemeTextarea(knobs) : knobs;
};
