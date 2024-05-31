import CivicThemePopover from './popover.twig';
import { generateSlots, knobRadios, knobText, placeholder, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Atoms/Popover',
  parameters: {
    layout: 'centered',
  },
};

export const Popover = (props = {}) => {
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
    trigger: {
      text: knobText('Trigger text', 'Click me', props.trigger_text, props.knobTab),
      url: knobText('Trigger URL', null, props.trigger_url, props.knobTab),
    },
    content: placeholder(),
    modifier_class: knobText('Additional classes', '', props.modifier_class, props.knobTab),
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
  };

  return shouldRender(props) ? CivicThemePopover({
    ...knobs,
    ...generateSlots([
      'content_top',
      'content_bottom',
    ]),
  }) : knobs;
};
