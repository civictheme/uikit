import { boolean, radios, text } from '@storybook/addon-knobs';
import { randomUrl } from '../../00-base/base.utils';
import CivicThemeLogo from './logo.twig';

export default {
  title: 'Molecules/Logo',
  parameters: {
    layout: 'centered',
  },
};

export const Logo = (knobTab, doRender = true, useKnobs = true, defaultTheme = 'light') => {
  const generalKnobTab = typeof knobTab === 'string' ? knobTab : 'General';

  const generalKnobs = {
    theme: useKnobs ? radios('Theme', {
      Light: 'light',
      Dark: 'dark',
    }, defaultTheme, generalKnobTab) : defaultTheme,
    type: useKnobs ? radios('Type', {
      Default: 'default',
      Stacked: 'stacked',
      Inline: 'inline',
      'Inline-Stacked': 'inline-stacked',
    }, 'default', generalKnobTab) : 'default',
    with_secondary_image: useKnobs ? boolean('With secondary image', false, generalKnobTab) : false,
    logos: {},
    url: useKnobs ? text('Link', randomUrl(), generalKnobTab) : randomUrl(),
    title: useKnobs ? text('Title', 'Logo title', generalKnobTab) : 'Logo title',
    attributes: useKnobs ? text('Additional attributes', '', generalKnobTab) : '',
    modifier_class: useKnobs ? text('Additional class', '', generalKnobTab) : '',
  };

  generalKnobs.logos = generalKnobs.with_secondary_image ? {
    primary: {
      mobile: {
        url: LOGOS[generalKnobs.theme].primary.mobile,
        alt: 'Primary logo mobile alt text',
      },
      desktop: {
        url: LOGOS[generalKnobs.theme].primary.desktop,
        alt: 'Primary logo desktop alt text',
      },
    },
    secondary: {
      mobile: {
        url: LOGOS[generalKnobs.theme].secondary.mobile,
        alt: 'Secondary logo mobile alt text',
      },
      desktop: {
        url: LOGOS[generalKnobs.theme].secondary.desktop,
        alt: 'Secondary logo desktop alt text',
      },
    },
  } : {
    primary: {
      mobile: {
        url: LOGOS[generalKnobs.theme].primary.mobile,
        alt: 'Primary logo mobile alt text',
      },
      desktop: {
        url: LOGOS[generalKnobs.theme].primary.desktop,
        alt: 'Primary logo mobile alt text',
      },
    },
  };

  return doRender ? CivicThemeLogo({
    ...generalKnobs,
  }) : generalKnobs;
};
