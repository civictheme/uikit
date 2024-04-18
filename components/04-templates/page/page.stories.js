import {
  boolean, radios,
} from '@storybook/addon-knobs';
import {
  demoImage, getSlots, randomInt, randomTags, randomLinks, randomSentence, randomUrl,
} from '../../00-base/base.utils';
import CivicThemePageExample from './page.stories.twig';
import '../../00-base/responsive/responsive';
import '../../00-base/collapsible/collapsible';
import '../../03-organisms/slider/slider';
import { generateMenuLinks } from '../../00-base/menu/menu.utils';
import { randomSlidesComponent } from '../../03-organisms/slider/slider.utils';
import CivicThemeItemGrid from '../../00-base/item-grid/item-grid.twig';
import PromoCard
  from '../../02-molecules/promo-card/promo-card.twig';
import EventCard
  from '../../02-molecules/event-card/event-card.twig';
import { Logo } from '../../02-molecules/logo/logo.stories';
import { Banner } from '../../03-organisms/banner/banner.stories';
import { BasicContent } from '../../02-molecules/basic-content/basic-content.stories';

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
    header_theme: theme,
    footer_theme: theme,
  };

  generalKnobs.logo = Logo('Logo', false, false, theme);

  generalKnobs.primary_navigation_items = generateMenuLinks(randomInt(3, 5), randomInt(3, 5), false);
  generalKnobs.secondary_navigation_items = generateMenuLinks(randomInt(2, 5), 1, false);

  generalKnobs.links1 = generateMenuLinks(4, 1, false);
  generalKnobs.links2 = generateMenuLinks(4, 1, false);
  generalKnobs.links3 = generateMenuLinks(4, 1, false);
  generalKnobs.links4 = generateMenuLinks(4, 1, false);

  generalKnobs.banner = Banner('Banner', false, theme);
  generalKnobs.hide_sidebar = true;

  const numOfSlides = randomInt(2, 5);

  const slides = randomSlidesComponent(numOfSlides, generalKnobs.theme, true, {
    image_position: 'right',
    tags: randomTags(2, randomInt(1, 4)),
    date: '20 Jan 2023 11:00',
    date_end: '21 Jan 2023 15:00',
    links: randomLinks(randomInt(1, 4), randomInt(6, 6)),
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
    header_theme: theme,
    footer_theme: theme,
    hide_sidebar: boolean('Hide Sidebar', false, generalKnobTab),
  };

  generalKnobs.logo = Logo('Logo', false, false, theme);

  generalKnobs.primary_navigation_items = generateMenuLinks(randomInt(3, 5), randomInt(3, 5), false);
  generalKnobs.secondary_navigation_items = generateMenuLinks(randomInt(2, 5), 1, false);

  generalKnobs.links1 = generateMenuLinks(4, 1, false);
  generalKnobs.links2 = generateMenuLinks(4, 1, false);
  generalKnobs.links3 = generateMenuLinks(4, 1, false);
  generalKnobs.links4 = generateMenuLinks(4, 1, false);

  generalKnobs.banner = Banner('Banner', false, theme);

  generalKnobs.side_navigation_items = generateMenuLinks(randomInt(3, 5), randomInt(3, 5), false);

  generalKnobs.page_content = BasicContent('BasicContent', false, theme);

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
