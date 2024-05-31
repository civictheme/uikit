import CivicThemeLink from './link.twig';
import { knobBoolean, knobRadios, knobSelect, knobText, randomUrl, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Atoms/Link',
  parameters: {
    layout: 'centered',
  },
};

export const Link = (props = {}) => {
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
    hidden_text: knobText('Link hidden text', 'Link hidden text', props.hidden_text, props.knobTab),
    url: knobText('URL', randomUrl(), props.url, props.knobTab),
    is_external: knobBoolean('Is external', false, props.is_external, props.knobTab),
    is_active: knobBoolean('Is active', false, props.is_active, props.knobTab),
    is_disabled: knobBoolean('Is disabled', false, props.is_disabled, props.knobTab),
    is_new_window: knobBoolean('Open in a new window', false, props.is_new_window, props.knobTab),
    with_icon: knobBoolean('With icon', false, props.with_icon, props.knobTab),
    modifier_class: knobText('Additional class', '', props.modifier_class, props.knobTab),
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
  };

  const iconKnobTab = 'Icon';
  const iconKnobs = knobs.with_icon ? {
    icon_placement: knobRadios(
      'Icon Position',
      {
        Before: 'before',
        After: 'after',
      },
      'before',
      props.icon_placement,
      iconKnobTab,
    ),
    icon: knobSelect('Icon', Object.values(ICONS), Object.values(ICONS)[0], props.icon, iconKnobTab),
  } : null;

  const combinedKnobs = { ...knobs, ...iconKnobs };

  return shouldRender(props) ? CivicThemeLink(combinedKnobs) : combinedKnobs;
};
