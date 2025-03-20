import '../../01-atoms/button/button.component.js'; /* generated */
import '../../01-atoms/button/button.css'; /* generated */
import '../../01-atoms/heading/heading.css'; /* generated */
import '../../01-atoms/link/link.css'; /* generated */
import '../../01-atoms/paragraph/paragraph.css'; /* generated */
import '../../02-molecules/back-to-top/back-to-top.css'; /* generated */
import '../../02-molecules/basic-content/basic-content.css'; /* generated */
import '../../02-molecules/breadcrumb/breadcrumb.css'; /* generated */
import '../../03-organisms/banner/banner.css'; /* generated */
import '../../03-organisms/footer/footer.css'; /* generated */
import '../../03-organisms/header/header.css'; /* generated */
import '../../03-organisms/side-navigation/side-navigation.css'; /* generated */
import '../../03-organisms/skip-link/skip-link.css'; /* generated */
import './page.css'; /* generated */

import Component from './page.twig';
import PageData from './page.stories.data';

const meta = {
  title: 'Templates/Page',
  component: Component,
  argTypes: {
    theme: {
      control: { type: 'radio' },
      options: ['light', 'dark'],
    },
    vertical_spacing: {
      control: { type: 'radio' },
      options: ['none', 'top', 'bottom', 'both'],
    },
    header_theme: {
      control: { type: 'radio' },
      options: ['light', 'dark'],
    },
    header_top_1: {
      control: { type: 'text' },
    },
    header_top_2: {
      control: { type: 'text' },
    },
    header_top_3: {
      control: { type: 'text' },
    },
    header_middle_1: {
      control: { type: 'text' },
    },
    header_middle_2: {
      control: { type: 'text' },
    },
    header_middle_3: {
      control: { type: 'text' },
    },
    header_bottom_1: {
      control: { type: 'text' },
    },
    banner: {
      control: { type: 'text' },
    },
    highlighted: {
      control: { type: 'text' },
    },
    content_top: {
      control: { type: 'text' },
    },
    hide_sidebar_left: {
      control: { type: 'boolean' },
    },
    hide_sidebar_right: {
      control: { type: 'boolean' },
    },
    sidebar_top_left: {
      control: { type: 'text' },
    },
    sidebar_top_left_attributes: {
      control: { type: 'text' },
    },
    sidebar_top_right: {
      control: { type: 'text' },
    },
    sidebar_top_right_attributes: {
      control: { type: 'text' },
    },
    content: {
      control: { type: 'text' },
    },
    content_attributes: {
      control: { type: 'text' },
    },
    sidebar_bottom_left: {
      control: { type: 'text' },
    },
    sidebar_bottom_left_attributes: {
      control: { type: 'text' },
    },
    sidebar: {
      control: { type: 'text' },
    },
    sidebar_attributes: {
      control: { type: 'text' },
    },
    sidebar_bottom_right: {
      control: { type: 'text' },
    },
    sidebar_bottom_right_attributes: {
      control: { type: 'text' },
    },
    content_contained: {
      control: { type: 'boolean' },
    },
    content_bottom: {
      control: { type: 'text' },
    },
    footer_theme: {
      control: { type: 'text' },
    },
    footer_logo: {
      control: { type: 'text' },
    },
    footer_background_image: {
      control: { type: 'text' },
    },
    footer_top_1: {
      control: { type: 'text' },
    },
    footer_top_2: {
      control: { type: 'text' },
    },
    footer_middle_1: {
      control: { type: 'text' },
    },
    footer_middle_2: {
      control: { type: 'text' },
    },
    footer_middle_3: {
      control: { type: 'text' },
    },
    footer_middle_4: {
      control: { type: 'text' },
    },
    footer_bottom_1: {
      control: { type: 'text' },
    },
    footer_bottom_2: {
      control: { type: 'text' },
    },
    attributes: {
      control: { type: 'text' },
    },
    modifier_class: {
      control: { type: 'text' },
    },
  },
};

export default meta;

export const Page = {
  parameters: {
    layout: 'fullscreen',
  },
  args: PageData.args('light'),
};

export const PageDark = {
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'Dark',
    },
  },
  args: PageData.args('dark'),
};
