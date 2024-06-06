import CivicThemeLabel from './label.twig';
import { knobBoolean, knobRadios, knobText, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Atoms/Label',
  parameters: {
    layout: 'centered',
  },
};

export const Label = (parentKnobs = {}) => {
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
      parentKnobs.knobTab,
    ),
    content: knobText('Content', 'Label content', parentKnobs.knobTab),
    for: knobText('For', '', parentKnobs.knobTab),
    is_required: knobBoolean('Required', false, parentKnobs.knobTab),
    modifier_class: knobText('Additional classes', '', parentKnobs.knobTab),
    attributes: knobText('Additional attributes', '', parentKnobs.knobTab),
  };

  return shouldRender(parentKnobs) ? CivicThemeLabel(knobs) : knobs;
};
