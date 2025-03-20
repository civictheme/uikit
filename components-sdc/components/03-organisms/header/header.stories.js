import '../../01-atoms/button/button.component.js'; /* generated */
import '../../01-atoms/button/button.css'; /* generated */
import '../../01-atoms/heading/heading.css'; /* generated */
import '../../01-atoms/link/link.css'; /* generated */
import '../../01-atoms/paragraph/paragraph.css'; /* generated */
import '../../02-molecules/logo/logo.css'; /* generated */
import '../../02-molecules/search/search.css'; /* generated */
import '../mobile-navigation/mobile-navigation.css'; /* generated */
import '../navigation/navigation.css'; /* generated */
import './header.css'; /* generated */

import Component from './header.twig';
import HeaderData from './header.stories.data';

const meta = {
  title: 'Organisms/Header',
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
    content_top3: {
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
    content_bottom1: {
      control: { type: 'text' },
    },
    modifier_class: {
      control: { type: 'text' },
    },
  },
};

export default meta;

export const Header = {
  parameters: {
    layout: 'fullscreen',
  },
  args: HeaderData.args('light'),
};

export const HeaderDark = {
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'Dark',
    },
  },
  args: HeaderData.args('dark'),
};

export const HeaderWithMobileNavSearchLink = {
  parameters: {
    layout: 'fullscreen',
  },
  args: HeaderData.args('light', { mobileSearchLink: true }),
};
