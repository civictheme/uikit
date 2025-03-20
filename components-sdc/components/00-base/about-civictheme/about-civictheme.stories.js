import '../../01-atoms/heading/heading.css'; /* generated */
import '../../01-atoms/paragraph/paragraph.css'; /* generated */
import '../../02-molecules/basic-content/basic-content.css'; /* generated */
import '../../02-molecules/logo/logo.css'; /* generated */

import Component from './about-civictheme.stories.twig';
import Constants from '../../../dist/constants.json'; // eslint-disable-line import/no-unresolved

const meta = {
  title: 'About CivicTheme',
  component: Component,
  argTypes: {
    logos: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;

export const AboutCivicTheme = {
  parameters: {
    layout: 'fullscreen',
    html: {
      disable: true,
    },
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
