import GroupFilter from '../../02-molecules/group-filter/group-filter.twig';
import GroupFilterData from '../../02-molecules/group-filter/group-filter.stories.data';
import SingleFilter from '../../02-molecules/single-filter/single-filter.twig';
import SingleFilterData from '../../02-molecules/single-filter/single-filter.stories.data';
import Grid from '../../00-base/grid/grid.twig';
import PromoCard from '../../02-molecules/promo-card/promo-card.twig';
import PromoCardData from '../../02-molecules/promo-card/promo-card.stories.data';
import EventCard from '../../02-molecules/event-card/event-card.twig';
import EventCardData from '../../02-molecules/event-card/event-card.stories.data';
import NavigationCard from '../../02-molecules/navigation-card/navigation-card.twig';
import NavigationCardData from '../../02-molecules/navigation-card/navigation-card.stories.data';
import Snippet from '../../02-molecules/snippet/snippet.twig';
import SnippetData from '../../02-molecules/snippet/snippet.stories.data';
import Paragraph from '../../01-atoms/paragraph/paragraph.twig';
import Pagination from '../../02-molecules/pagination/pagination.twig';
import PaginationData from '../../02-molecules/pagination/pagination.stories.data';

export default {
  args: (theme = 'light', options = {}) => {
    const components = {
      promo: { data: PromoCardData.args('light'), render: PromoCard },
      event: { data: EventCardData.args('light'), render: EventCard },
      navigation: { data: NavigationCardData.args('light'), render: NavigationCard },
      snippet: { data: SnippetData.args(theme), render: Snippet },
    };
    const component = options.component || 'promo';
    const { render } = components[component];
    const defaultData = components[component].data;
    const itemData = options.items || Array.from(Array(6), () => ({}));
    const items = itemData.map((data) => render({ ...defaultData, ...data }));
    return {
      theme,
      title: 'My List Title',
      link_above: {
        text: 'View more',
        url: 'http://www.example.com',
        title: 'View more',
        is_new_window: false,
        is_external: false,
      },
      content: 'Example content',
      filters: options.group ? GroupFilter(GroupFilterData.args(theme)) : SingleFilter(SingleFilterData.args(theme)),
      selected_filters: options.group ? [
        { text: 'Filter 1', url: '#', label: 'Remove filter: Filter 1' },
        { text: 'Filter 2', url: '#', label: 'Remove filter: Filter 2' },
        { text: 'Filter 3', url: '#', label: 'Remove filter: Filter 3' },
        { text: 'Filter 4', url: '#', label: 'Remove filter: Filter 4' },
        { text: 'Filter 5', url: '#', label: 'Remove filter: Filter 5' },
        { text: 'Filter 6', url: '#', label: 'Remove filter: Filter 6' },
        { text: 'Filter 7', url: '#', label: 'Remove filter: Filter 7' },
        { text: 'Filter 8', url: '#', label: 'Remove filter: Filter 8' },
        { text: 'Filter 9', url: '#', label: 'Remove filter: Filter 9' },
        { text: 'Filter 10', url: '#', label: 'Remove filter: Filter 10' },
      ] : [],
      selected_filters_clear_link: {
        text: 'Clear all',
        url: '#',
      },
      results_count: 'Showing 1 of 6',
      rows_above: Paragraph({
        theme,
        content: 'Example content above rows',
        allow_html: true,
      }),
      rows: Grid({
        theme,
        items,
        template_column_count: options.columnCount || 3,
        fill_width: false,
        with_background: false,
        row_class: 'row--equal-heights-content row--vertically-spaced',
      }),
      rows_below: Paragraph({
        theme,
        content: `Example content below rows`,
        allow_html: true,
      }),
      empty: '<p>No results found</p>',
      pagination: Pagination(PaginationData.args(theme)),
      footer: '',
      link_below: {
        text: 'View more',
        url: 'http://www.example.com',
        title: 'View more',
        is_new_window: false,
        is_external: false,
      },
      vertical_spacing: 'none',
      with_background: false,
      attributes: '',
      modifier_class: '',
    };
  },
};
