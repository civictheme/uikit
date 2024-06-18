import CivicThemePagination from './pagination.twig';
import { knobBoolean, knobNumber, knobRadios, knobText, randomId, randomName, randomUrl, shouldRender } from '../../00-base/storybook/storybook.utils';

export default {
  title: 'Molecules/List/Pagination',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Pagination = (parentKnobs = {}) => {
  const knobs = {
    theme: knobRadios(
      'Theme',
      {
        Light: 'light',
        Dark: 'dark',
      },
      'light',
      parentKnobs.theme,
      parentKnobs.knobTab,
    ),
    active_is_link: knobBoolean('Active is a link', true, parentKnobs.active_is_link, parentKnobs.knobTab),
    use_ellipsis: knobBoolean('With ellipsis', false, parentKnobs.use_ellipsis, parentKnobs.knobTab),
    with_items_per_page: knobBoolean('With items per page', true, parentKnobs.with_items_per_page, parentKnobs.knobTab),
    heading_id: knobText('Heading ID', 'ct-pagination-demo', parentKnobs.heading_id, parentKnobs.knobTab),
    modifier_class: knobText('Additional classes', '', parentKnobs.modifier_class, parentKnobs.knobTab),
    attributes: knobText('Additional attributes', '', parentKnobs.attributes, parentKnobs.knobTab),
  };

  knobs.count_of_pages = knobNumber(
    'Count of pages',
    5,
    {
      range: true,
      min: 0,
      max: 10,
      step: 1,
    },
    parentKnobs.count_of_pages,
    parentKnobs.knobTab,
  );

  knobs.current_page = knobNumber(
    'Current page',
    Math.max(1, Math.floor(knobs.count_of_pages / 2)),
    {
      range: true,
      min: 1,
      max: knobs.count_of_pages,
      step: 1,
    },
    parentKnobs.current_page,
    parentKnobs.knobTab,
  );

  const paginationMiddle = Math.ceil(knobs.count_of_pages / 2);
  const paginationFirst = knobs.current - paginationMiddle + 1;
  const paginationLast = knobs.current + knobs.count_of_pages - paginationMiddle;

  const pages = {};
  for (let i = 0; i < knobs.count_of_pages; i++) {
    if (knobs.use_ellipsis) {
      if (i === 0 || (i > paginationFirst && i < paginationLast) || i === (knobs.count_of_pages - 1)) {
        pages[i + 1] = {
          href: randomUrl(),
        };
      }
    } else {
      pages[i + 1] = {
        href: randomUrl(),
      };
    }
  }

  const items = knobs.count_of_pages > 0 ? {
    previous: {
      href: randomUrl(),
    },
    pages,
    next: {
      href: randomUrl(),
    },
  } : null;

  const props = {
    theme: knobs.theme,
    active_is_link: knobs.active_is_link,
    items,
    heading_id: knobs.heading_id,
    use_ellipsis: knobs.use_ellipsis,
    total_pages: knobs.count_of_pages,
    current: knobs.current,
    modifier_class: knobs.modifier_class,
    attributes: knobs.attributes,
  };

  if (knobs.with_items_per_page) {
    props.items_per_page_label = 'Items per page';
    props.items_per_page_name = randomName();
    props.items_per_page_id = randomId();

    props.items_per_page_options = [
      {
        type: 'option',
        label: 10,
        value: 10,
        is_selected: false,
      },
      {
        type: 'option',
        label: 20,
        value: 20,
        is_selected: true,
      },
      {
        type: 'option',
        label: 50,
        value: 50,
        is_selected: false,
      },
      {
        type: 'option',
        label: 100,
        value: 100,
        is_selected: false,
      },
    ];
  }

  return shouldRender(parentKnobs) ? CivicThemePagination(props) : knobs;
};
