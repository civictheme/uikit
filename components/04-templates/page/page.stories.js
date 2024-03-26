import {
  boolean, select, radios,
} from '@storybook/addon-knobs';
import { getSlots, randomInt } from '../../00-base/base.utils';
import CivicThemePageExample from './page.stories.twig';
import '../../00-base/responsive/responsive';
import '../../00-base/collapsible/collapsible';
import { generateMenuLinks } from '../../00-base/menu/menu.utils';

import { Logo } from '../../02-molecules/logo/logo.stories';

export default {
  title: 'Templates/Page',
  parameters: {
    layout: 'fullscreen',
  },
};

export const HomePage = (knobTab) => {
  const generalKnobTab = typeof knobTab === 'string' ? knobTab : 'General';

  const generalKnobs = {
    theme: radios(
      'Theme',
      {
        Light: 'light',
        Dark: 'dark',
      },
      'light',
      generalKnobTab,
    ),
    back_to_top: boolean('Show back to top', true, generalKnobTab),
  };

  generalKnobs.logo = Logo('Logo', false);

  generalKnobs.primary_navigation_items = generateMenuLinks(randomInt(3, 5), randomInt(3, 5), false);

  generalKnobs.secondary_navigation_items = generateMenuLinks(randomInt(2, 5), 1, false);

  generalKnobs.links1 = generateMenuLinks(4, 1, false);
  generalKnobs.links2 = generateMenuLinks(4, 1, false);
  generalKnobs.links3 = generateMenuLinks(4, 1, false);
  generalKnobs.links4 = generateMenuLinks(4, 1, false);

  if (boolean('Show background image', false, generalKnobTab)) {
    generalKnobs.footer_background_image = BACKGROUNDS[select('Background', Object.keys(BACKGROUNDS), Object.keys(BACKGROUNDS)[0], generalKnobTab)];
  }

  return CivicThemePageExample({
    ...generalKnobs,
    ...getSlots([
      'content_top1',
      'content_top2',
      'content_top3',
      'content_middle1',
      'content_middle2',
      'content_middle3',
      'content_middle4',
      'content_bottom1',
      'content_bottom2',
    ]),
  });
};

export const ContentPage = (knobTab) => {
  const generalKnobTab = typeof knobTab === 'string' ? knobTab : 'General';

  const generalKnobs = {
    theme: radios(
      'Theme',
      {
        Light: 'light',
        Dark: 'dark',
      },
      'light',
      generalKnobTab,
    ),
    back_to_top: boolean('Show back to top', true, generalKnobTab),
  };

  generalKnobs.logo = Logo('Logo', false);

  generalKnobs.primary_navigation_items = generateMenuLinks(randomInt(3, 5), randomInt(3, 5), false);

  generalKnobs.secondary_navigation_items = generateMenuLinks(randomInt(2, 5), 1, false);

  generalKnobs.links1 = generateMenuLinks(4, 1, false);
  generalKnobs.links2 = generateMenuLinks(4, 1, false);
  generalKnobs.links3 = generateMenuLinks(4, 1, false);
  generalKnobs.links4 = generateMenuLinks(4, 1, false);

  if (boolean('Show background image', false, generalKnobTab)) {
    generalKnobs.footer_background_image = BACKGROUNDS[select('Background', Object.keys(BACKGROUNDS), Object.keys(BACKGROUNDS)[0], generalKnobTab)];
  }

  return CivicThemePageExample({
    ...generalKnobs,
    ...getSlots([
      'content_top1',
      'content_top2',
      'content_top3',
      'content_middle1',
      'content_middle2',
      'content_middle3',
      'content_middle4',
      'content_bottom1',
      'content_bottom2',
    ]),
  });
};
