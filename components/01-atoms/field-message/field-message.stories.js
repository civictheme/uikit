import CivicThemeFieldMessage from './field-message.twig';
import { knobRadios, knobText, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Atoms/Form Controls/Field Message',
  parameters: {
    layout: 'centered',
  },
};

export const FieldMessage = (parentKnobs = {}) => {
  const knobs = {
    theme: knobRadios(
      'Theme',
      {
        Light: 'light',
        Dark: 'dark',
      },
      'light',
      parentKnobs.theme,
      parentKnobs.knobTab,
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
      parentKnobs.type,
      parentKnobs.knobTab,
    ),
    content: knobText('Content', 'Field message content', parentKnobs.content, parentKnobs.knobTab),
    modifier_class: knobText('Additional classes', '', parentKnobs.modifier_class, parentKnobs.knobTab),
    attributes: knobText('Additional attributes', '', parentKnobs.attributes, parentKnobs.knobTab),
  };

  return shouldRender(parentKnobs) ? CivicThemeFieldMessage(knobs) : knobs;
};
