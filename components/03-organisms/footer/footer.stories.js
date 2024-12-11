import Component from './footer.twig';
import Constants from '../../../dist/constants.json'; // eslint-disable-line import/no-unresolved

import { Logo as LogoStory } from '../../02-molecules/logo/logo.stories';
import Logo from '../../02-molecules/logo/logo.twig';
import { Navigation as NavigationStory } from '../navigation/navigation.stories';
import Navigation from '../navigation/navigation.twig';
import SocialLinks from '../../02-molecules/social-links/social-links.twig';

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
  args: {
    theme: 'light',
    content_top1: Logo(LogoStory.args).trim(),
    content_top2: SocialLinks({
      theme: 'light',
      with_border: true,
      items: [
        {
          title: 'Facebook',
          icon: 'facebook',
          url: 'https://www.facebook.com',
        },
        {
          title: 'X',
          icon: 'x',
          url: 'https://www.twitter.com',
        },
        {
          title: 'LinkedIn',
          icon: 'linkedin',
          url: 'https://www.linkedin.com',
        },
      ],
    }).trim(),
    content_middle1: Navigation({
      ...NavigationStory.args,
      theme: 'light',
      title: 'Services',
    }).trim(),
    content_middle2: Navigation({
      ...NavigationStory.args,
      theme: 'light',
      title: 'About us',
    }).trim(),
    content_middle3: Navigation({
      ...NavigationStory.args,
      theme: 'light',
      title: 'Help',
    }).trim(),
    content_middle4: Navigation({
      ...NavigationStory.args,
      theme: 'light',
      title: 'Resources',
    }).trim(),
    content_bottom1: '<div class="ct-footer__acknowledgement ct-text-regular">We acknowledge the traditional owners of the country throughout Australia and their continuing connection to land, sea and community. We pay our respect to them and their cultures and to the elders past and present.</div>',
    content_bottom2: '<div class="copyright ct-text-regular">©Commonwealth of Australia</div>',
    background_image: '',
    modifier_class: '',
  },
};
