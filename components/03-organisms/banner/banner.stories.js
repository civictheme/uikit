import Component from './banner.twig';
import Constants from '../../../dist/constants.json'; // eslint-disable-line import/no-unresolved

import CivicThemeParagraph from '../../01-atoms/paragraph/paragraph.twig';
import CivicThemeButton from '../../01-atoms/button/button.twig';
import CivicThemeNavigationCard from '../../02-molecules/navigation-card/navigation-card.twig';
import CivicThemeGrid from '../../00-base/grid/grid.twig';

const meta = {
  title: 'Organisms/Banner',
  component: Component,
  argTypes: {
    theme: {
      control: { type: 'radio' },
      options: ['light', 'dark'],
    },
    content_top1: {
      control: { type: 'text' },
    },
    breadcrumb: {
      control: { type: 'array' },
    },
    content_top2: {
      control: { type: 'text' },
    },
    content_top3: {
      control: { type: 'text' },
    },
    content_middle: {
      control: { type: 'text' },
    },
    content: {
      control: { type: 'text' },
    },
    content_bottom: {
      control: { type: 'text' },
    },
    content_below: {
      control: { type: 'text' },
    },
    site_section: {
      control: { type: 'text' },
    },
    title: {
      control: { type: 'text' },
    },
    is_decorative: {
      control: { type: 'boolean' },
    },
    featured_image: {
      control: { type: 'object' },
    },
    background_image: {
      control: { type: 'object' },
    },
    background_image_blend_mode: {
      control: { type: 'select' },
      options: Constants.SCSS_VARIABLES['ct-background-blend-modes'],
    },
    modifier_class: {
      control: { type: 'text' },
    },
    attributes: {
      control: { type: 'text' },
    },
  },
};

export default meta;

export const Banner = {
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    theme: 'dark',
    breadcrumb: {
      links: [
        {
          text: 'Link 1',
          url: 'https://example.com/breadcrumb-1',
        },
        {
          text: 'Link 2',
          url: 'https://example.com/breadcrumb-2',
        },
        {
          text: 'Link 3',
          url: 'https://example.com/breadcrumb-2',
        },
      ],
      active_is_link: false,
    },
    site_section: 'Site section name',
    title: 'Providing visually engaging digital experiences',
    is_decorative: true,
    featured_image: {
      url: './demo/images/demo2.jpg',
      alt: 'Featured image alt text',
    },
    background_image: {
      url: Constants.BACKGROUNDS[Object.keys(Constants.BACKGROUNDS)[0]],
      alt: 'Background image alt text',
    },
    background_image_blend_mode: 'multiply',
    content_top1: '',
    content_top2: '',
    content_top3: '',
    content_middle: '',
    content: CivicThemeParagraph({
      theme: 'dark',
      allow_html: true,
      content: `<p>Government grade set of high quality design themes that are accessible, inclusive and provide a consistent digital experience for your citizen. </p><p>${CivicThemeButton({
        theme: 'dark',
        text: 'Learn about our mission',
        type: 'primary',
        kind: 'link',
      }).trim()}</p>`,
    }).trim(),
    content_bottom: '',
    content_below: CivicThemeGrid({
      theme: 'dark',
      template_column_count: 4,
      items: [
        CivicThemeNavigationCard({
          theme: 'dark',
          title: 'Register for a workshop',
          summary: 'Est sed aliqua ullamco occaecat velit nisi in dolor excepteur.',
          icon: 'mortarboard',
        }).trim(),
        CivicThemeNavigationCard({
          theme: 'dark',
          title: 'Register for a workshop',
          summary: 'Ea dolor enim eiusmod consectetur proident adipisicing aute dolor ad est.',
          icon: 'mortarboard',
        }).trim(),
        CivicThemeNavigationCard({
          theme: 'dark',
          title: 'Register for a workshop',
          summary: 'Anim occaecat ex nostrud non do sunt ut nostrud mollit aliqua.',
          icon: 'mortarboard',
        }).trim(),
        CivicThemeNavigationCard({
          theme: 'dark',
          title: 'Register for a workshop',
          summary: 'Sunt duis dolore voluptate quis do in.',
          icon: 'mortarboard',
        }).trim(),
      ],
      row_class: 'row--equal-heights-content row--vertically-spaced',
    }).trim(),
    modifier_class: '',
    attributes: '',
  },
};
