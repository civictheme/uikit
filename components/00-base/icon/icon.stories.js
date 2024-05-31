import merge from 'deepmerge';
import CivicThemeIcon from './icon.twig';
import { arrayCombine, knobRadios, knobSelect, knobText, shouldRender, toLabels } from '../base.utils';

export default {
  title: 'Base/Icon',
  parameters: {
    layout: 'centered',
  },
};

export const Icon = (props = {}) => {
  const defaultSizes = SCSS_VARIABLES['ct-icon-sizes-default'];
  const customSizes = SCSS_VARIABLES['ct-icon-sizes'];
  let sizes = Object.keys(merge(defaultSizes, customSizes));

  sizes = arrayCombine(toLabels(sizes), sizes);
  sizes = merge({ Auto: 'auto' }, sizes);

  const knobs = {
    symbol: knobSelect('Symbol', ICONS, ICONS[0], props.symbol, props.knobTab),
    alt: knobText('Alt', 'Icon alt text', props.alt, props.knobTab),
    size: knobRadios('Size', sizes, 'auto', props.size, props.knobTab),
    modifier_class: knobText('Additional classes', '', props.modifier_class, props.knobTab),
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
  };

  return shouldRender(props) ? CivicThemeIcon(knobs) : knobs;
};
