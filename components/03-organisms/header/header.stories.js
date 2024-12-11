import Component from './header.twig';

import Logo from '../../02-molecules/logo/logo.twig';
import { Logo as LogoStory } from '../../02-molecules/logo/logo.stories';
import Paragraph from '../../01-atoms/paragraph/paragraph.twig';
import Navigation from '../navigation/navigation.twig';
import { Navigation as NavigationStory } from '../navigation/navigation.stories';
import Search from '../../02-molecules/search/search.twig';
import { MobileNavigation as MobileNavigationStory } from '../mobile-navigation/mobile-navigation.stories';
import MobileNavigationPanel from '../mobile-navigation/mobile-navigation.twig';
import MobileNavigationTrigger from '../mobile-navigation/mobile-navigation-trigger.twig';

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
  args: {
    theme: 'light',
    content_top1: '',
    content_top2: Paragraph({
      theme: 'light',
      content: 'A design system by Salsa Digital',
    }).trim(),
    content_top3: Navigation({
      ...NavigationStory.args,
      theme: 'light',
      name: 'secondary',
      title: null,
      type: 'dropdown',
      modifier_class: 'ct-flex-justify-content-end',
    }).trim(),
    content_middle1: '',
    content_middle2: Logo({
      ...LogoStory.args,
      theme: 'light',
    }).trim(),
    content_middle3: [
      Navigation({
        ...NavigationStory.args,
        theme: 'light',
        name: 'primary',
        title: null,
        type: 'drawer',
        modifier_class: 'ct-flex-justify-content-end',
      }).trim(),
      Search({
        theme: 'light',
        text: 'Search',
        url: '/search',
        modifier_class: 'ct-flex-justify-content-end',
      }).trim(),
      MobileNavigationTrigger({
        theme: 'light',
        icon: 'bars',
        text: 'Menu',
      }).trim(),
      MobileNavigationPanel(MobileNavigationStory.args).trim(),
    ].join(''),
    content_bottom1: '',
    modifier_class: '',
  },
};
