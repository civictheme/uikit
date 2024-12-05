import Component from './welcome.stories.twig';
import Constants from '../../../dist/constants.json'; // eslint-disable-line import/no-unresolved

const meta = {
  title: 'Welcome',
  component: Component,
};

export default meta;

export const Welcome = {
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
