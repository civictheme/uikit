import CivicThemePopover from './popover.twig';
import { generateSlots, knobRadios, knobText, placeholder, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Atoms/Popover',
  parameters: {
    layout: 'centered',
  },
};

export const Popover = (parentKnobs = {}) => {
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
    trigger: {
      text: knobText('Trigger text', 'Click me', parentKnobs.trigger_text, parentKnobs.knobTab),
      url: knobText('Trigger URL', null, parentKnobs.trigger_url, parentKnobs.knobTab),
    },
    content: placeholder(),
    modifier_class: knobText('Additional classes', '', parentKnobs.modifier_class, parentKnobs.knobTab),
    attributes: knobText('Additional attributes', '', parentKnobs.attributes, parentKnobs.knobTab),
  };

  return shouldRender(parentKnobs) ? CivicThemePopover({
    ...knobs,
    ...generateSlots([
      'content_top',
      'content_bottom',
    ]),
  }) : knobs;
};
