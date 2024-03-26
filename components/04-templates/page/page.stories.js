import {
  boolean, select, radios, number, text,
} from '@storybook/addon-knobs';
import {
  demoImage, getSlots, randomInt, randomTags, randomLinks, randomSentence, randomUrl,
} from '../../00-base/base.utils';
import CivicThemePageExample from './page.stories.twig';
import '../../00-base/responsive/responsive';
import '../../00-base/collapsible/collapsible';
import '../../03-organisms/slider/slider';
import getMenuLinks, { generateMenuLinks } from '../../00-base/menu/menu.utils';
import { Breadcrumb } from '../../02-molecules/breadcrumb/breadcrumb.stories';
import { randomSlidesComponent } from '../../03-organisms/slider/slider.utils';
import CivicThemeItemGrid from '../../00-base/item-grid/item-grid.twig';
import PromoCard
  from '../../02-molecules/promo-card/promo-card.twig';
import EventCard
  from '../../02-molecules/event-card/event-card.twig';

import { Logo } from '../../02-molecules/logo/logo.stories';

export default {
  title: 'Templates/Page',
  parameters: {
    layout: 'fullscreen',
  },
};

export const HomePage = (knobTab) => {
  const generalKnobTab = typeof knobTab === 'string' ? knobTab : 'General';

  const theme = radios(
    'Theme',
    {
      Light: 'light',
      Dark: 'dark',
    },
    'light',
    generalKnobTab,
  );

  const generalKnobs = {
    theme,
  };

  generalKnobs.logo = Logo('Logo', false);

  generalKnobs.primary_navigation_items = generateMenuLinks(randomInt(3, 5), randomInt(3, 5), false);

  generalKnobs.secondary_navigation_items = generateMenuLinks(randomInt(2, 5), 1, false);

  generalKnobs.links1 = generateMenuLinks(4, 1, false);
  generalKnobs.links2 = generateMenuLinks(4, 1, false);
  generalKnobs.links3 = generateMenuLinks(4, 1, false);
  generalKnobs.links4 = generateMenuLinks(4, 1, false);

  generalKnobs.title = 'Providing visually engaging digital experiences';
  generalKnobs.background_image = {
    url: './assets/backgrounds/civictheme_background_1.png',
  };
  generalKnobs.background_image_blend_mode = 'normal';
  generalKnobs.featured_image = {
    url: demoImage(0),
    alt: 'Featured image alt text',
  };
  generalKnobs.is_decorative = true;
  generalKnobs.site_section = 'Site section name';
  generalKnobs.breadcrumb = Breadcrumb('Breadcrumb', false);
  const slidesKnobTab = 'Slide';
  const numOfSlides = number(
    'Number of slides',
    5,
    {
      range: true,
      min: 0,
      max: 10,
      step: 1,
    },
    slidesKnobTab,
  );

  const slides = randomSlidesComponent(numOfSlides, generalKnobs.theme, true, {
    image_position: radios('Image Position', {
      Left: 'left',
      Right: 'right',
    }, 'right', slidesKnobTab),
    tags: randomTags(number(
      'Number of tags',
      2,
      {
        range: true,
        min: 0,
        max: 10,
        step: 1,
      },
      slidesKnobTab,
    ), true),
    date: text('Date', '20 Jan 2023 11:00', slidesKnobTab),
    date_end: text('End date', '21 Jan 2023 15:00', slidesKnobTab),
    links: randomLinks(number(
      'Number of links',
      2,
      {
        range: true,
        min: 0,
        max: 10,
        step: 1,
      },
      slidesKnobTab,
    ), 10),
    ...getSlots([
      'content_top',
      'content_bottom',
    ]),
  }).join(' ');

  generalKnobs.slides = slides;

  const itemsPromo = [];
  const itemComponentInstancePromo = PromoCard;
  const itemsEvent = [];
  const itemComponentInstanceEvent = EventCard;
  const columnCount = 3;
  const itemsPerPage = 6;
  const resultNumber = 6;
  const itemTags = randomTags(2, true);
  const itemsCount = itemsPerPage > resultNumber ? resultNumber : itemsPerPage;
  for (let i = 0; i < itemsCount; i++) {
    const itemProps = {
      theme: generalKnobs.theme,
      title: `Title ${randomSentence(randomInt(1, 5))}`,
      date: new Date().toLocaleDateString('en-uk', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      summary: `Summary ${randomSentence(randomInt(15, 25))}`,
      url: randomUrl(),
      image: {
        url: demoImage(),
        alt: 'Image alt text',
      },
      size: 'large',
      tags: itemTags,
    };

    itemsPromo.push(itemComponentInstancePromo(itemProps));
  }

  for (let i = 0; i < itemsCount; i++) {
    const itemProps = {
      theme: generalKnobs.theme,
      title: `Title ${randomSentence(randomInt(1, 5))}`,
      date: new Date().toLocaleDateString('en-uk', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      summary: `Summary ${randomSentence(randomInt(15, 25))}`,
      url: randomUrl(),
      image: false,
      size: 'large',
      tags: itemTags,
    };

    itemsEvent.push(itemComponentInstanceEvent(itemProps));
  }

  generalKnobs.rows_promo = CivicThemeItemGrid({
    theme,
    items: itemsPromo,
    column_count: columnCount,
    fill_width: false,
    with_background: false,
  });

  generalKnobs.rows_event = CivicThemeItemGrid({
    theme,
    items: itemsEvent,
    column_count: columnCount,
    fill_width: false,
    with_background: false,
  });

  generalKnobs.results_count = `Showing ${itemsCount} of ${resultNumber}`;

  generalKnobs.rows_above = `Example content above rows ${randomSentence(randomInt(10, 75))}`;

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
    is_contained: boolean('Contained', true, generalKnobTab),
    hide_sidebar: boolean('Hide Sidebar', true, generalKnobTab),
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

  generalKnobs.side_navigation_items = getMenuLinks('Links');

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
