import CivicThemeFieldMessage from './field-message.twig';
import { knobRadios, knobText, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Atoms/Field Message',
  parameters: {
    layout: 'centered',
  },
};

export const FieldMessage = (props = {}) => {
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
    type: knobRadios(
      'Type',
      {
        Error: 'error',
        Information: 'information',
        Warning: 'warning',
        Success: 'success',
      },
      'error',
      props.knobTab,
    ),
    content: knobText('Content', 'Field message content', props.knobTab),
    modifier_class: knobText('Additional classes', '', props.knobTab),
    attributes: knobText('Additional attributes', '', props.knobTab),
  };

  return shouldRender(props) ? CivicThemeFieldMessage(knobs) : knobs;
};
