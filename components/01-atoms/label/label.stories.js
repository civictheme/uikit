import CivicThemeLabel from './label.twig';
import { knobBoolean, knobRadios, knobText, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Atoms/Label',
  parameters: {
    layout: 'centered',
  },
};

export const Label = (props = {}) => {
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
    size: knobRadios(
      'Size',
      {
        'Extra Large': 'extra-large',
        Large: 'large',
        Regular: 'regular',
        Small: 'small',
        'Extra Small': 'extra-small',
        None: '',
      },
      'regular',
      props.knobTab,
    ),
    content: knobText('Content', 'Label content', props.knobTab),
    for: knobText('For', '', props.knobTab),
    is_required: knobBoolean('Required', false, props.knobTab),
    modifier_class: knobText('Additional classes', '', props.knobTab),
    attributes: knobText('Additional attributes', '', props.knobTab),
  };

  return shouldRender(props) ? CivicThemeLabel(knobs) : knobs;
};
