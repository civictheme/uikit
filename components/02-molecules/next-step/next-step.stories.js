import CivicThemeNextSteps from './next-step.twig';
import { generateSlots, knobBoolean, knobRadios, knobText, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Molecules/Next Steps',
};

export const NextSteps = (props = {}) => {
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
    title: knobText('Title', 'Next steps title from knob', props.title, props.knobTab),
    content: knobText('Content', 'Short summary explaining why this link is relevant.', props.content, props.knobTab),
    link: {
      text: knobText('Link text', 'Sign up', props.link_text, props.knobTab),
      url: knobText('Link URL', 'https://example.com', props.link_url, props.knobTab),
      is_new_window: knobBoolean('Link opens in new window', true, props.link_is_new_window, props.knobTab),
      is_external: knobBoolean('Link is external', true, props.link_is_external, props.knobTab),
    },
    vertical_spacing: knobRadios(
      'Vertical spacing',
      {
        None: 'none',
        Top: 'top',
        Bottom: 'bottom',
        Both: 'both',
      },
      'none',
      props.vertical_spacing,
      props.knobTab,
    ),
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
    modifier_class: knobText('Additional class', '', props.modifier_class, props.knobTab),
  };

  return shouldRender(props) ? CivicThemeNextSteps({
    ...knobs,
    ...generateSlots([
      'content_top',
      'content_bottom',
    ]),
  }) : knobs;
};
