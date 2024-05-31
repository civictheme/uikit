import CivicThemePromo from './promo.twig';
import { generateSlots, knobBoolean, knobRadios, knobText, randomSentence, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Organisms/Promo',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Promo = (props = {}) => {
  const knobs = {
    theme: knobRadios(
      'Theme',
      {
        Light: 'light',
        Dark: 'dark',
      },
      'dark',
      props.theme,
      props.knobTab,
    ),
    title: knobText('Title', 'Sign up for industry news and updates from CivicTheme', props.title, props.knobTab),
    content: knobText('Content', randomSentence(), props.content, props.knobTab),
    is_contained: knobBoolean('Contained', true, props.is_contained, props.knobTab),
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
    with_background: knobBoolean('With background', false, props.with_background, props.knobTab),
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
    modifier_class: knobText('Additional classes', '', props.modifier_class, props.knobTab),
  };

  return shouldRender(props) ? CivicThemePromo({
    ...knobs,
    ...generateSlots([
      'content_top',
      'content_bottom',
    ]),
  }) : knobs;
};
