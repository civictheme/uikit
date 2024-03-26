import {
  boolean, radios, number, text,
} from '@storybook/addon-knobs';
import {
  demoImage, getSlots, randomInt, randomTags, randomLinks, randomSentence, randomUrl, demoVideoPoster, demoVideos,
} from '../../00-base/base.utils';
import CivicThemePageExample from './page.stories.twig';
import '../../00-base/responsive/responsive';
import '../../00-base/collapsible/collapsible';
import '../../03-organisms/slider/slider';
import getMenuLinks, { generateMenuLinks } from '../../00-base/menu/menu.utils';
import { Breadcrumb } from '../../02-molecules/breadcrumb/breadcrumb.stories';
import { randomSlidesComponent } from '../../03-organisms/slider/slider.utils';
import CivicThemeItemGrid from '../../00-base/item-grid/item-grid.twig';
import CivicThemeContentLink from '../../01-atoms/content-link/content-link.twig';
import CivicThemeButton from '../../01-atoms/button/button.twig';
import CivicThemeTable from '../../01-atoms/table/table.twig';
import CivicThemeFigure from '../../02-molecules/figure/figure.twig';
import CivicThemeVideoPlayer from '../../02-molecules/video-player/video-player.twig';
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
  generalKnobs.hide_sidebar = true;
  generalKnobs.site_section = 'Site section name';
  generalKnobs.breadcrumb = Breadcrumb('Breadcrumb', false);
  generalKnobs.content_below = true;
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
    is_contained: boolean('Contained', true, generalKnobTab),
    hide_sidebar: boolean('Hide Sidebar', false, generalKnobTab),
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
  generalKnobs.site_section = 'Section Heading';
  generalKnobs.breadcrumb = Breadcrumb('Breadcrumb', false);

  generalKnobs.side_navigation_items = getMenuLinks('Links');

  let html = '';

  // Headings.
  html += `
    <h1>Heading 1</h1>
    <h2>Heading 2</h2>
    <h3>Heading 3</h3>
    <h4>Heading 4</h4>
    <h5>Heading 5</h5>
    <h6>Heading 6</h6>
  `;

  // Paragraphs.
  html += `
    <p>Text without a class sed aute in sed consequat veniam excepteur minim mollit.</p>
    <p class="ct-text-large">Large text sed aute in sed consequat veniam excepteur minim mollit.</p>
    <p class="ct-text-regular">Regular text veniam reprehenderit velit ea veniam occaecat magna est sed duis quis elit occaecat dolore ut enim est do in dolor non elit aliquip commodo aliquip sint veniam ullamco adipisicing tempor ad.</p>
    <p class="ct-text-small">Small text <span>duis sunt velit.</span><span>Ea eu non.</span></p>
    <p>In mollit in minim ut non ${CivicThemeContentLink({
    theme,
    text: 'commodo dolore',
    url: 'https://example.com',
  })} nisi anim.</p>
    <p>Deserunt in ex dolore. <sup>Super cupidatat esse.</sup> <sub>Sub do mollit aute labore.</sub></p>
    <p>Primary button link within text mollit in minim ut non ${CivicThemeButton({
    theme,
    kind: 'link',
    type: 'primary',
    text: 'Primary button text',
    url: 'https://example.com',
  })} nisi anim.</p>
    <p>Secondary button link within text mollit in minim ut non ${CivicThemeButton({
    theme,
    kind: 'link',
    type: 'secondary',
    text: 'Secondary button text',
    url: 'https://example.com',
  })} nisi anim.</p>
    <p>Tertiary button link within text mollit in minim ut non ${CivicThemeButton({
    theme,
    kind: 'link',
    type: 'tertiary',
    text: 'Tertiary button text',
    url: 'https://example.com',
  })} nisi anim.</p>
    <p>Sed aute in sed consequat veniam excepteur minim mollit.</p>
  `;

  // Blockquote.
  html += `
    <blockquote>Culpa laboris sit fugiat minim ad commodo eu id sint eu sed nisi.</blockquote>
    <blockquote>Culpa laboris sit fugiat minim ad commodo eu id sint eu sed nisi.<cite>Sed aute</cite></blockquote>
  `;

  // Lists.
  html += `
    <ul>
      <li>Sint pariatur quis tempor.</li>
      <li>Lorem ipsum dolore laborum nulla ut.</li>
      <li>Deserunt ullamco occaecat anim cillum.</li>
    </ul>
    <ol>
      <li>Id nostrud id sit nulla.</li>
      <li>Dolore ea cillum culpa nulla.</li>
      <li>Lorem ipsum ex excepteur.</li>
    </ol>
    <p>Number list with bullet children</p>
    <ol>
        <li>Number</li>
        <li>Number</li>
        <li>Number
          <ul>
            <li>Bullet</li>
            <li>Bullet</li>
          </ul>
        </li>
        <li>Number</li>
        <li>Number</li>
    </ol>
    <p>Bullet list with number children</p>
    <ul>
        <li>Bullet</li>
        <li>Bullet
          <ol>
            <li>Number</li>
            <li>Number</li>
          </ol>
        </li>
        <li>Bullet</li>
        <li>Bullet</li>
        <li>Bullet</li>
    </ul>
  `;

  // Image.
  html += CivicThemeFigure({
    theme,
    url: demoImage(),
    alt: 'Occaecat laborum voluptate cupidatat.',
    caption: 'Commodo anim sint minim.',
  });

  // Video Player.
  html += CivicThemeVideoPlayer({
    theme,
    sources: demoVideos(),
    poster: demoVideoPoster(),
  });

  // Table.
  html += CivicThemeTable({
    theme,
    header: [
      'Column A',
      'Column B',
      'Column C',
    ],
    rows: [
      [
        'Do duis minim cupidatat eu.',
        'Ullamco sunt dolore.',
        'Dolor in officia.',
      ],
      [
        'Do duis minim cupidatat eu.',
        'Ullamco sunt dolore.',
        'Dolor in officia.',
      ],
      [
        'Lorem ipsum magna sint.',
        'Consequat qui anim.',
        'Lorem ipsum aliqua veniam deserunt.',
      ],
    ],
  });

  generalKnobs.page_content = html;

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
