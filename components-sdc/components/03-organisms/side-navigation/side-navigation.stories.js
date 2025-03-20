import '../../01-atoms/heading/heading.css'; /* generated */
import '../../01-atoms/link/link.css'; /* generated */
import '../skip-link/skip-link.css'; /* generated */
import './side-navigation.css'; /* generated */

import Component from './side-navigation.twig';
import SideNavigationData from './side-navigation.stories.data';

const meta = {
  title: 'Organisms/Navigation/Side Navigation',
  component: Component,
  argTypes: {
    theme: {
      control: { type: 'radio' },
      options: ['light', 'dark'],
    },
    items: {
      control: { type: 'array' },
    },
    title: {
      control: { type: 'text' },
    },
    vertical_spacing: {
      control: { type: 'radio' },
      options: ['none', 'top', 'bottom', 'both'],
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

export const SideNavigation = {
  parameters: {
    layout: 'centered',
  },
  args: SideNavigationData.args('light'),
};
