import CivicThemeFieldMessage from './field-message.twig';
import { knobRadios, knobText, randomLink, randomSentence, shouldRender } from '../../00-base/storybook/storybook.utils';

export default {
  title: 'Atoms/Form Controls/Field Message',
  parameters: {
    layout: 'centered',
    storyLayoutSize: 'medium',
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
    content: knobText('Content', `Field message content sample. ${randomSentence(50)}`, parentKnobs.content, parentKnobs.knobTab),
    modifier_class: knobText('Additional classes', '', parentKnobs.modifier_class, parentKnobs.knobTab),
    attributes: knobText('Additional attributes', '', parentKnobs.attributes, parentKnobs.knobTab),
  };

  if (knobs.content.length > 0) {
    knobs.content += ` ${randomLink()}`;
  }

  return shouldRender(parentKnobs) ? CivicThemeFieldMessage(knobs) : knobs;
};
