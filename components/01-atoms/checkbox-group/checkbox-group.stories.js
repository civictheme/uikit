import CivicThemeCheckboxGroup from './checkbox-group.twig';
import { knobText, knobBoolean, knobNumber, knobRadios, shouldRender, randomFields } from '../../00-base/base.utils';

export default {
  title: 'Atoms/Checkbox Group',
  parameters: {
    layout: 'centered',
  },
};

export const CheckboxGroup = (props = {}) => {
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
    direction: knobRadios(
      'Direction',
      {
        Horizontal: 'horizontal',
        Vertical: 'vertical',
      },
      'vertical',
      props.knobTab,
    ),
    items: randomFields(knobNumber(
      'Items count',
      5,
      {
        range: true,
        min: 0,
        max: 10,
        step: 1,
      },
      props.knobTab,
    ), props.theme, false, 'checkbox'),
    content: knobText('Content', 'Checkbox label', props.knobTab),
    disabled: knobBoolean('Disabled', false, props.knobTab),
    has_error: knobBoolean('Has error', false, props.knobTab),
    for: knobText('For', '', props.knobTab),
    modifier_class: `story-wrapper-size--small ${knobText('Additional class', '', props.knobTab)}`,
    attributes: knobText('Additional attributes', '', props.knobTab),
  };

  return shouldRender(props) ? CivicThemeCheckboxGroup(knobs) : knobs;
};
