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
      props.theme,
      props.knobTab,
    ),
    direction: knobRadios(
      'Direction',
      {
        Horizontal: 'horizontal',
        Vertical: 'vertical',
      },
      'vertical',
      props.direction,
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
    name: knobText('Name', 'checkbox-name', props.name, props.knobTab),
    content: knobText('Content', 'Checkbox label', props.content, props.knobTab),
    is_disabled: knobBoolean('Disabled', false, props.is_disabled, props.knobTab),
    has_error: knobBoolean('Has error', false, props.has_error, props.knobTab),
    for: knobText('For', '', props.for, props.knobTab),
    modifier_class: `story-wrapper-size--small ${knobText('Additional class', '', props.knobTab)}`,
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
  };

  return shouldRender(props) ? CivicThemeCheckboxGroup(knobs) : knobs;
};
