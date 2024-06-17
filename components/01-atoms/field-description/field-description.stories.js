import CivicThemeFieldDescription from './field-description.twig';
import { knobRadios, knobText, randomLink, randomSentence, shouldRender } from '../../00-base/storybook/storybook.utils';

export default {
  title: 'Atoms/Form Controls/Field Description',
  parameters: {
    layout: 'centered',
    storyLayoutSize: 'medium',
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
    content: knobText('Content', `Field description content sample. ${randomSentence(50)}`, parentKnobs.content, parentKnobs.knobTab),
    modifier_class: knobText('Additional classes', '', parentKnobs.modifier_class, parentKnobs.knobTab),
    attributes: knobText('Additional attributes', '', parentKnobs.attributes, parentKnobs.knobTab),
  };

  if (knobs.content.length > 0) {
    knobs.content += ` ${randomLink()}`;
  }

  return shouldRender(parentKnobs) ? CivicThemeFieldDescription(knobs) : knobs;
};
