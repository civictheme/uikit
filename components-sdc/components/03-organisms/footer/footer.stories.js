import '../../01-atoms/button/button.component.js'; /* generated */
import '../../01-atoms/button/button.css'; /* generated */
import '../../01-atoms/heading/heading.css'; /* generated */
import '../../01-atoms/link/link.css'; /* generated */
import '../../02-molecules/logo/logo.css'; /* generated */
import '../../02-molecules/social-links/social-links.css'; /* generated */
import '../navigation/navigation.css'; /* generated */
import './footer.css'; /* generated */

import Component from './footer.twig';
import FooterData from './footer.stories.data';
import Constants from '../../../dist/constants.json'; // eslint-disable-line import/no-unresolved

const meta = {
  title: 'Organisms/Footer',
  component: Component,
  argTypes: {
    theme: {
      control: { type: 'radio' },
      options: ['light', 'dark'],
    },
    content_top1: {
      control: { type: 'text' },
    },
    content_top2: {
      control: { type: 'text' },
    },
    content_middle1: {
      control: { type: 'text' },
    },
    content_middle2: {
      control: { type: 'text' },
    },
    content_middle3: {
      control: { type: 'text' },
    },
    content_middle4: {
      control: { type: 'text' },
    },
    content_middle5: {
      control: { type: 'text' },
    },
    content_bottom1: {
      control: { type: 'text' },
    },
    content_bottom2: {
      control: { type: 'text' },
    },
    background_image: {
      control: { type: 'select' },
      options: Constants.BACKGROUNDS,
    },
    modifier_class: {
      control: { type: 'text' },
    },
  },
};

export default meta;

export const Footer = {
  parameters: {
    layout: 'fullscreen',
  },
  args: FooterData.args('light'),
};

export const FooterDark = {
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'Dark',
    },
  },
  args: FooterData.args('dark'),
};
