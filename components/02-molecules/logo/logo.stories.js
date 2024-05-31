import { knobBoolean, knobRadios, knobText, randomUrl, shouldRender } from '../../00-base/base.utils';
import CivicThemeLogo from './logo.twig';

export default {
  title: 'Molecules/Logo',
  parameters: {
    layout: 'centered',
  },
};

export const Logo = (props = {}) => {
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
    type: knobRadios(
      'Type',
      {
        Default: 'default',
        Stacked: 'stacked',
        Inline: 'inline',
        'Inline-Stacked': 'inline-stacked',
      },
      'default',
      props.type,
      props.knobTab,
    ),
    with_secondary_image: knobBoolean('With secondary image', false, props.with_secondary_image, props.knobTab),
    logos: {},
    url: knobText('Link', randomUrl(), props.url, props.knobTab),
    title: knobText('Title', 'Logo title', props.title, props.knobTab),
    attributes: knobText('Additional attributes', '', props.attributes, props.knobTab),
    modifier_class: knobText('Additional class', '', props.modifier_class, props.knobTab),
  };

  knobs.logos = knobs.with_secondary_image ? {
    primary: {
      mobile: {
        url: LOGOS[knobs.theme].primary.mobile,
        alt: 'Primary logo mobile alt text',
      },
      desktop: {
        url: LOGOS[knobs.theme].primary.desktop,
        alt: 'Primary logo desktop alt text',
      },
    },
    secondary: {
      mobile: {
        url: LOGOS[knobs.theme].secondary.mobile,
        alt: 'Secondary logo mobile alt text',
      },
      desktop: {
        url: LOGOS[knobs.theme].secondary.desktop,
        alt: 'Secondary logo desktop alt text',
      },
    },
  } : {
    primary: {
      mobile: {
        url: LOGOS[knobs.theme].primary.mobile,
        alt: 'Primary logo mobile alt text',
      },
      desktop: {
        url: LOGOS[knobs.theme].primary.desktop,
        alt: 'Primary logo mobile alt text',
      },
    },
  };

  return shouldRender(props) ? CivicThemeLogo(knobs) : knobs;
};
