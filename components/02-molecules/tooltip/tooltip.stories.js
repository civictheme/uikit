import merge from 'deepmerge';
import CivicThemeTooltip from './tooltip.twig';
import './tooltip';

import '../../00-base/collapsible/collapsible';
import { knobRadios, knobSelect, knobText, randomText, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Molecules/Tooltip',
  parameters: {
    layout: 'centered',
  },
};

export const Tooltip = (props = {}) => {
  const defaultSizes = SCSS_VARIABLES['ct-icon-sizes-default'];
  const customSizes = SCSS_VARIABLES['ct-icon-sizes'];
  const sizes = Object.keys(merge(defaultSizes, customSizes));

  const knobs = {
    theme: knobRadios(
      'Theme',
      {
        Light: 'light',
        Dark: 'dark',
      },
      'light',
      props.theme,
      props.knobTab,
    ),
    position: knobRadios(
      'Position',
      {
        Auto: 'auto',
        Left: 'left',
        Right: 'right',
        Top: 'top',
        Bottom: 'bottom',
      },
      'auto',
      props.position,
      props.knobTab,
    ),
    icon: knobSelect('Icon', Object.values(ICONS), 'information-mark', props.icon, props.knobTab),
    icon_size: knobRadios('Icon size', sizes, sizes[2], props.icon_size, props.knobTab),
    title: knobText('Title', 'Toggle tooltip display', props.title, props.knobTab),
    content: knobText('Content', randomText(), props.content, props.knobTab),
    modifier_class: knobText('Additional classes', '', props.modifier_class, props.knobTab),
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
  };

  return shouldRender(props) ? CivicThemeTooltip(knobs) : knobs;
};
