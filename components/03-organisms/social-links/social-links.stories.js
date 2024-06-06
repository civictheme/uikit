import CivicThemeSocialLinks from './social-links.twig';
import { generateIcon, knobBoolean, knobRadios, knobText, shouldRender } from '../../00-base/base.utils';
import CivicThemeIcon from '../../00-base/icon/icon.twig';

export default {
  title: 'Organisms/Social Links',
  parameters: {
    layout: 'centered',
  },
};

export const SocialLinks = (props = {}) => {
  const items = [
    {
      icon_html: `<img class="ct-button__icon" width=16 height=16 src="${generateIcon()}"/>`,
      url: 'https://www.dropbox.com',
      // Deliberately left without a title.
    },
    {
      title: 'Facebook',
      icon: 'facebook',
      url: 'https://www.facebook.com',
    },
    {
      title: 'Instagram',
      icon: 'instagram',
      url: 'https://www.instagram.com',
    },
    {
      title: 'Icon with inline SVG',
      // icon_html should take precedence.
      icon_html: CivicThemeIcon({
        symbol: 'linkedin',
        size: 'small',
      }),
      icon: 'linkedin',
      url: 'https://www.linkedin.com',
    },
    {
      title: 'X',
      icon: 'x',
      url: 'https://www.twitter.com',
    },
    {
      title: 'YouTube',
      icon: 'youtube',
      url: 'https://www.youtube.com',
    },
  ];

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
    items: knobBoolean('With items', true, props.with_items, props.knobTab) ? props.items || items : null,
    with_border: knobBoolean('With border', true, props.with_border, props.knobTab),
    modifier_class: knobText('Additional class', '', props.modifier_class, props.knobTab),
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
  };

  return shouldRender(props) ? CivicThemeSocialLinks(knobs) : knobs;
};
