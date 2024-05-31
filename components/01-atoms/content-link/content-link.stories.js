import CivicThemeContentLink from './content-link.twig';
import { knobBoolean, knobRadios, knobText, randomUrl, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Atoms/Content Link',
  parameters: {
    layout: 'centered',
  },
};

export const ContentLink = (props = {}) => {
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
    text: knobText('Text', 'Link text', props.text, props.knobTab),
    title: knobText('Title', 'Link title', props.link_title, props.knobTab),
    url: knobText('URL', randomUrl(), props.url, props.knobTab),
    is_external: knobBoolean('Is external', false, props.is_external, props.knobTab),
    is_new_window: knobBoolean('Open in a new window', false, props.is_new_window, props.knobTab),
    modifier_class: knobText('Additional class', '', props.modifier_class, props.knobTab),
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
  };

  return shouldRender(props) ? CivicThemeContentLink(knobs) : knobs;
};
