import CivicThemeSelect from './select.twig';
import { generateSelectOptions, knobBoolean, knobRadios, knobText, randomInt, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Atoms/Select',
  parameters: {
    layout: 'centered',
    wrapperSize: 'small',
    wrapperIsContainer: true,
    wrapperIsResizable: true,
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
      props.theme,
      props.knobTab,
    ),
    is_multiple: knobBoolean('Is multiple', false, props.is_multiple, props.knobTab),
    options: knobBoolean('With options', true, props.options, props.knobTab) ? generateSelectOptions(randomInt(3, 5), (knobBoolean('Options have groups', false, null, props.knobTab) ? 'optgroup' : 'option')) : [],
    is_required: knobBoolean('Required', false, props.is_required, props.knobTab),
    is_disabled: knobBoolean('Disabled', false, props.is_disabled, props.knobTab),
    has_error: knobBoolean('Has error', false, props.has_error, props.knobTab),
    for: knobText('For', '', props.for, props.knobTab),
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
    modifier_class: knobText('Additional classes', '', props.modifier_class, props.knobTab),
  };

  return shouldRender(props) ? CivicThemeSelect(knobs) : knobs;
};
