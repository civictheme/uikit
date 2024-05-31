import CivicThemeFieldDescription from './field-description.twig';
import { knobRadios, knobText, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Atoms/Field Description',
  parameters: {
    layout: 'centered',
  },
};

export const FieldDescription = (props = {}) => {
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
    size: knobRadios(
      'Size',
      {
        Large: 'large',
        Regular: 'regular',
      },
      'regular',
      props.size,
      props.knobTab,
    ),
    content: knobText('Content', 'We will only use this to respond to your question.', props.content, props.knobTab),
    modifier_class: knobText('Additional classes', '', props.modifier_class, props.knobTab),
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
  };

  return shouldRender(props) ? CivicThemeFieldDescription(knobs) : knobs;
};
