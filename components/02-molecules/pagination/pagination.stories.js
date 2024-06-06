import CivicThemePagination from './pagination.twig';
import { knobBoolean, knobNumber, knobRadios, knobText, randomUrl, shouldRender } from '../../00-base/base.utils';

export default {
  title: 'Molecules/Pagination',
};

export const Pagination = (parentKnobs = {}) => {
  const theme = knobRadios(
    'Theme',
    {
      Light: 'light',
      Dark: 'dark',
    },
    'light',
    parentKnobs.theme,
    parentKnobs.knobTab,
  );
  const activeIsLink = knobBoolean('Active is a link', true, parentKnobs.active_is_link, parentKnobs.knobTab);

  const pageCount = knobNumber(
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

  const current = knobNumber(
    'Current page',
    Math.max(1, Math.floor(pageCount / 2)),
    {
      range: true,
      min: 1,
      max: pageCount,
      step: 1,
    },
    parentKnobs.current_page,
    parentKnobs.knobTab,
  );
  const useEllipsis = knobBoolean('With ellipsis', false, parentKnobs.use_ellipsis, parentKnobs.knobTab);

  const pages = {};
  const pagerMiddle = Math.ceil(pageCount / 2);
  const pagerFirst = current - pagerMiddle + 1;
  const pagerLast = current + pageCount - pagerMiddle;
  for (let i = 0; i < pageCount; i++) {
    if (useEllipsis) {
      if (i === 0 || (i > pagerFirst && i < pagerLast) || i === (pageCount - 1)) {
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

  const items = pageCount > 0 ? {
    previous: {
      href: randomUrl(),
    },
    pages,
    next: {
      href: randomUrl(),
    },
  } : null;

  const itemsPerPage = [
    {
      type: 'option', label: 10, value: 10, selected: false,
    },
    {
      type: 'option', label: 20, value: 20, selected: true,
    },
    {
      type: 'option', label: 50, value: 50, selected: false,
    },
    {
      type: 'option', label: 100, value: 100, selected: false,
    },
  ];

  const knobs = {
    theme,
    active_is_link: activeIsLink,
    items,
    heading_id: knobText('Heading Id', 'ct-pager-demo', parentKnobs.heading_id, parentKnobs.knobTab),
    use_ellipsis: useEllipsis,
    items_per_page_options: knobBoolean('With items per page', true, parentKnobs.with_items_per_page, parentKnobs.knobTab) ? itemsPerPage : null,
    total_pages: pageCount,
    current,
    modifier_class: knobText('Additional classes', '', parentKnobs.modifier_class, parentKnobs.knobTab),
    attributes: knobText('Additional attributes', '', parentKnobs.attributes, parentKnobs.knobTab),
  };

  return shouldRender(parentKnobs) ? CivicThemePagination(knobs) : knobs;
};
