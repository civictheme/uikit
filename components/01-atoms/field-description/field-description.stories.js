import CivicThemeFieldDescription from './field-description.twig';
import { knobRadios, knobText, shouldRender } from '../../00-base/storybook/storybook.utils';

export default {
  title: 'Atoms/Form Controls/Field Description',
  parameters: {
    layout: 'centered',
  },
};

export const FieldDescription = (parentKnobs = {}) => {
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
    size: knobRadios(
      'Size',
      {
        Large: 'large',
        Regular: 'regular',
      },
      'regular',
      parentKnobs.size,
      parentKnobs.knobTab,
    ),
    content: knobText('Content', 'We will only use this to respond to your question.', parentKnobs.content, parentKnobs.knobTab),
    modifier_class: knobText('Additional classes', '', parentKnobs.modifier_class, parentKnobs.knobTab),
    attributes: knobText('Additional attributes', '', parentKnobs.attributes, parentKnobs.knobTab),
  };

  return shouldRender(parentKnobs) ? CivicThemeFieldDescription(knobs) : knobs;
};
