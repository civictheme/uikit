import CivicThemeTextIcon from './text-icon.twig';
import { knobBoolean, knobRadios, knobSelect, knobText, shouldRender, randomText } from '../storybook/storybook.utils';

export default {
  title: 'Base/Text Icon',
  parameters: {
    layout: 'centered',
  },
};

export const TextIcon = (parentKnobs = {}) => {
  const knobs = {
    text: knobText('Text', randomText(8), parentKnobs.text, parentKnobs.knobTab),
    is_new_window: knobBoolean('Open in a new window', false, parentKnobs.is_new_window, parentKnobs.knobTab),
    is_external: knobBoolean('Is external', false, parentKnobs.is_external, parentKnobs.knobTab),
    icon_placement: knobRadios(
      'Icon Position',
      {
        Before: 'before',
        After: 'after',
      },
      'before',
      parentKnobs.icon_placement,
      parentKnobs.knobTab,
    ),
    icon: knobSelect('Icon', Object.values(ICONS), Object.values(ICONS)[0], parentKnobs.icon, parentKnobs.knobTab),
    icon_class: knobText('Icon class', '', parentKnobs.icon_class, parentKnobs.knobTab),
  };

  return shouldRender(parentKnobs) ? CivicThemeTextIcon(knobs) : knobs;
};
