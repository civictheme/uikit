import { convertDate, generateImage, knobBoolean, knobNumber, knobRadios, knobText, randomFormElements, randomInt, randomName, randomSentence, randomString, randomTags, randomText, randomUrl, shouldRender } from '../../00-base/base.utils';

import CivicThemeGroupFilter from '../../02-molecules/group-filter/group-filter.twig';
import CivicThemeSingleFilter from '../../02-molecules/single-filter/single-filter.twig';
import CivicThemeGrid from '../../00-base/grid/grid.twig';
import PromoCard from '../../02-molecules/promo-card/promo-card.twig';
import NavigationCard from '../../02-molecules/navigation-card/navigation-card.twig';
import Snippet from '../../02-molecules/snippet/snippet.twig';
import CivicThemeList from './list.twig';
import { Pagination } from '../../02-molecules/pagination/pagination.stories';

export default {
  title: 'Organisms/List',
  parameters: {
    layout: 'fullscreen',
  },
};

export const List = (props = {}) => {
  const knobs = {
    theme: knobRadios(
      'Theme',
      {
        Light: 'light',
        Dark: 'dark',
      },
      'light',
      props.theme,
      props.knobTab,
    ),
    title: knobText('Title', 'List title', props.title, props.knobTab),
    content: knobBoolean('With content', true, props.with_content, props.knobTab) ? randomSentence(50) : null,
  };

  knobs.link_above = knobBoolean('With link above', true, props.with_link_above, props.knobTab) ? {
    text: knobText('Link above text', 'View more', props.link_above_text, 'Content'),
    url: 'http://www.example.com',
    title: 'View more',
    is_new_window: false,
    is_external: false,
  } : null;

  knobs.link_below = knobBoolean('With link below', true, props.with_link_below, props.knobTab) ? {
    text: knobText('Link below text', 'View more', props.link_below_text, 'Content'),
    url: 'http://www.example.com',
    title: 'View more',
    is_new_window: false,
    is_external: false,
  } : null;

  knobs.vertical_spacing = knobRadios(
    'Vertical spacing',
    {
      None: 'none',
      Top: 'top',
      Bottom: 'bottom',
      Both: 'both',
    },
    'none',
    props.vertical_spacing,
    props.knobTab,
  );

  knobs.with_background = knobBoolean('With background', false, props.with_background, props.knobTab);

  knobs.modifier_class = knobText('Additional class', '', props.modifier_class, props.knobTab);

  const showFilters = knobBoolean('Show filters', true, props.show_filter, props.knobTab);
  const showItems = knobBoolean('Show items', true, props.show_items, props.knobTab);
  const showPager = knobBoolean('Show pager', true, props.show_pager, props.knobTab);

  let filtersCount = 0;

  // Build filters.
  if (showFilters) {
    const filtersKnobTab = 'Filters';

    const filterType = knobRadios(
      'Filter type',
      {
        Single: 'single',
        Group: 'group',
      },
      'single',
      props.filter_type,
      filtersKnobTab,
    );

    filtersCount = knobNumber(
      'Number of filters',
      3,
      {
        range: true,
        min: 0,
        max: 15,
        step: 1,
      },
      props.number_of_filters,
      filtersKnobTab,
    );

    if (filterType === 'single') {
      const name = randomName(5);
      const items = [];
      if (filtersCount > 0) {
        for (let i = 0; i < filtersCount; i++) {
          items.push({
            text: `Filter ${i + 1}${randomString(3)}`,
            name: knobs.is_multiple ? name + (i + 1) : name,
            attributes: `id="${name}_${randomName(3)}_${i + 1}"`,
          });
        }
      }

      const filterKnobs = {
        theme: knobs.theme,
        is_multiple: true,
        items,
      };

      knobs.filters = shouldRender(props) ? CivicThemeSingleFilter(filterKnobs) : filterKnobs;
    } else {
      const filters = [];
      if (filtersCount > 0) {
        for (let j = 0; j < filtersCount; j++) {
          filters.push({
            content: randomFormElements(1, knobs.theme, true)[0],
            title: `Filter ${randomString(randomInt(3, 8))} ${j + 1}`,
          });
        }
      }

      const filterKnobs = {
        theme: knobs.theme,
        title: 'Filter search results by:',
        filters,
      };

      knobs.filters = shouldRender(props) ? CivicThemeGroupFilter(filterKnobs) : filterKnobs;
    }
  }

  // Build pagination.
  if (showPager) {
    const pagerKnobs = {
      theme: knobs.theme,
      heading_id: 'ct-listing-demo',
    };

    knobs.pager = shouldRender(props) ? Pagination({ ...pagerKnobs, ...{ knobTab: 'Pagination' } }) : pagerKnobs;
  }

  // Build items.
  if (showItems) {
    const itemsKnobTab = 'List items';

    const resultNumber = knobNumber(
      'Number of results',
      6,
      {
        range: true,
        min: 0,
        max: 48,
        step: 6,
      },
      props.number_of_results,
      itemsKnobTab,
    );

    // Create markup for no results.
    if (resultNumber === 0) {
      knobs.empty = '<p>No results found</p>';
    }

    const viewItemAs = knobRadios(
      'Item type',
      {
        'Promo card': 'promo-card',
        'Navigation card': 'navigation-card',
        Snippet: 'snippet',
      },
      'promo-card',
      props.item_type,
      itemsKnobTab,
    );

    const itemsPerPage = knobNumber(
      'Items per page',
      6,
      {
        range: true,
        min: 6,
        max: 48,
        step: 6,
      },
      props.items_per_page,
      itemsKnobTab,
    );

    if (resultNumber > 0) {
      const itemTheme = knobRadios(
        'Theme',
        {
          Light: 'light',
          Dark: 'dark',
        },
        'light',
        props.item_theme,
        itemsKnobTab,
      );

      const columnCount = knobNumber(
        'Number of columns',
        3,
        {
          range: true,
          min: 1,
          max: 4,
          step: 1,
        },
        null,
        itemsKnobTab,
      );

      const itemWithImage = knobBoolean('With image', true, props.item_with_image, itemsKnobTab);

      const itemTags = randomTags(knobNumber(
        'Number of tags',
        2,
        {
          range: true,
          min: 0,
          max: 10,
          step: 1,
        },
        props.item_number_of_tags,
        itemsKnobTab,
      ), true);

      let itemComponentInstance;
      switch (viewItemAs) {
        case 'promo-card':
          itemComponentInstance = PromoCard;
          break;
        case 'navigation-card':
          itemComponentInstance = NavigationCard;
          break;
        case 'snippet':
          itemComponentInstance = Snippet;
          break;
        default:
          itemComponentInstance = PromoCard;
      }

      const items = [];
      const itemsCount = itemsPerPage > resultNumber ? resultNumber : itemsPerPage;
      for (let i = 0; i < itemsCount; i++) {
        const itemProps = {
          theme: itemTheme,
          title: `Title ${randomSentence(randomInt(1, 5))}`,
          date: convertDate(null),
          summary: `Summary ${randomSentence(randomInt(15, 25))}`,
          url: randomUrl(),
          image: itemWithImage ? {
            url: generateImage(),
            alt: 'Image alt text',
          } : false,
          size: 'large',
          tags: itemTags,
        };

        items.push(itemComponentInstance(itemProps));
      }

      const itemsKnobs = {
        theme: knobs.theme,
        items,
        column_count: columnCount,
        fill_width: false,
        with_background: knobs.with_background,
      };

      knobs.rows = shouldRender(props) ? CivicThemeGrid(itemsKnobs) : itemsKnobs;

      knobs.results_count = knobBoolean('With result count', true, props.results_count, props.knobTab) ? `Showing ${itemsCount} of ${resultNumber}` : null;
      knobs.rows_above = knobBoolean('With content above rows', true, props.rows_above, props.knobTab) ? `Example content above rows ${randomText(randomInt(10, 75))}` : null;
      knobs.rows_below = knobBoolean('With content below rows', true, props.rows_below, props.knobTab) ? `Example content below rows ${randomText(randomInt(10, 75))}` : null;
    }
  }

  return shouldRender(props) ? CivicThemeList(knobs) : knobs;
};
