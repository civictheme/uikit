import Component from './about-civictheme.stories.twig';
import Constants from '../../../dist/constants.json'; // eslint-disable-line import/no-unresolved

const meta = {
  component: Component,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    logos: {
      primary: {
        mobile: {
          url: Constants.LOGOS.light.civictheme.mobile,
        },
        desktop: {
          url: Constants.LOGOS.light.civictheme.desktop,
        },
      },
    },
  },
};

export default meta;

export const AboutCivicTheme = {};
