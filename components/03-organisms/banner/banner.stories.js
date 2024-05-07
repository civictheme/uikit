import {
  boolean, radios, select, text,
} from '@storybook/addon-knobs';
import { generateImage, generateSlots, objectFromArray } from '../../00-base/base.utils';
import CivicThemeBannerExample from './banner.stories.twig';
import { Breadcrumb } from '../../02-molecules/breadcrumb/breadcrumb.stories';

export default {
  title: 'Organisms/Banner',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Banner = (knobTab, useKnobs = true, defaultTheme = 'dark') => {
  const generalKnobTab = typeof knobTab === 'string' ? knobTab : 'General';
  const breadcrumbKnobTab = 'Breadcrumb';
  const bgImageKnobTab = 'Background Image';
  const featuredImage = {
    url: generateImage(0),
    alt: 'Featured image alt text',
  };

  const theme = useKnobs ? radios(
    'Theme',
    {
      Light: 'light',
      Dark: 'dark',
    },
    defaultTheme,
    generalKnobTab,
  ) : defaultTheme;

  const breadcrumb = Breadcrumb(breadcrumbKnobTab, false, false, theme);

  const withBgImage = useKnobs ? boolean('With background image', true, generalKnobTab) : true;

  const generalKnobs = {
    theme,
    title: useKnobs ? text('Title', 'Providing visually engaging digital experiences', generalKnobTab) : 'Providing visually engaging digital experiences',
    background_image: useKnobs ? withBgImage ? BACKGROUNDS[select('Background', Object.keys(BACKGROUNDS), Object.keys(BACKGROUNDS)[0], bgImageKnobTab)] : null : Object.keys(BACKGROUNDS)[0],
    background_image_blend_mode: useKnobs ? withBgImage ? select(
      'Blend mode',
      objectFromArray(SCSS_VARIABLES['ct-background-blend-modes']),
      SCSS_VARIABLES['ct-background-blend-modes'][0],
      bgImageKnobTab,
    ) : null : SCSS_VARIABLES['ct-background-blend-modes'][0],
    featured_image: useKnobs ? boolean('With featured image', true, generalKnobTab) ? featuredImage : null : featuredImage,
    is_decorative: useKnobs ? boolean('Decorative', true, generalKnobTab) : true,
    site_section: useKnobs ? boolean('With site section', true, generalKnobTab) ? 'Site section name' : '' : 'Site section name',
    breadcrumb: useKnobs ? boolean('With breadcrumb', true, generalKnobTab) ? breadcrumb : '' : breadcrumb,
    show_content_text: useKnobs ? boolean('With content text', true, generalKnobTab) : true,
    show_content_below: useKnobs ? boolean('With content below', false, generalKnobTab) : true,
    modifier_class: useKnobs ? text('Additional class', '', generalKnobTab) : '',
  };

  return CivicThemeBannerExample({
    ...generalKnobs,
    ...generateSlots([
      'content_top1',
      'content_top2',
      'content_top3',
      'content_middle',
      'content',
      'content_bottom',
    ]),
  });
};
