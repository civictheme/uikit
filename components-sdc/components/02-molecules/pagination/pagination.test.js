const template = 'components/02-molecules/pagination/pagination.twig';

describe('Pagination Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      theme: 'light',
      items: {
        previous: { text: 'Previous', href: '#previous' },
        pages: {
          1: { href: '#1' },
          2: { href: '#2' },
          3: { href: '#3' },
        },
        next: { text: 'Next', href: '#next' },
      },
      current: '2',
    });

    expect(c.querySelectorAll('.ct-pagination')).toHaveLength(1);
    const pages = c.querySelectorAll('.ct-pagination__item');
    expect(pages).toHaveLength(5); // Previous, 1, 2 (current), 3, Next
    expect(c.querySelector('.ct-pagination__item--active .ct-pagination__item__link').textContent.trim()).toEqual('2');
    expect(c.querySelector('.ct-pagination__item--previous .ct-pagination__link').getAttribute('href')).toEqual('#previous');
    expect(c.querySelector('.ct-pagination__item--next .ct-pagination__link').getAttribute('href')).toEqual('#next');

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      theme: 'dark',
      heading_id: 'pagination-heading',
      items: {
        first: { text: 'First', href: '#first' },
        previous: { text: 'Previous', href: '#previous' },
        pages: {
          1: { href: '#1' },
          2: { href: '#2' },
          3: { href: '#3' },
        },
        next: { text: 'Next', href: '#next' },
        last: { text: 'Last', href: '#last' },
      },
      current: '2',
      items_per_page_title: 'Items per page',
      items_per_page_options: [
        { type: 'option', label: '10', value: '10', selected: 'selected' },
        { type: 'option', label: '20', value: '20' },
        { type: 'option', label: '50', value: '50' },
      ],
      items_per_page_name: 'itemsPerPage',
      items_per_page_id: 'items-per-page',
      items_per_page_attributes: 'data-test="items-per-page"',
      use_ellipsis: true,
      attributes: 'data-test="pagination"',
      modifier_class: 'custom-class',
    });

    const element = c.querySelector('.ct-pagination');
    expect(element).not.toBeNull();
    expect(element.classList.contains('ct-theme-dark')).toBe(true);
    expect(element.classList.contains('custom-class')).toBe(true);
    expect(element.getAttribute('data-test')).toEqual('pagination');

    const heading = c.querySelector('#pagination-heading');
    expect(heading).not.toBeNull();
    expect(heading.textContent.trim()).toEqual('Pagination');

    const itemsPerPage = c.querySelector('.ct-pagination__items_per_page');
    expect(itemsPerPage).toBeTruthy();
    expect(itemsPerPage.querySelector('select').getAttribute('name')).toEqual('itemsPerPage');
    expect(itemsPerPage.querySelector('select').getAttribute('id')).toEqual('items-per-page');
    expect(itemsPerPage.querySelector('.ct-field').getAttribute('data-test')).toEqual('items-per-page');
    const options = itemsPerPage.querySelector('select').querySelectorAll('option');
    expect(options).toHaveLength(3);

    const ellipses = c.querySelectorAll('.ct-pagination__item--ellipsis');
    expect(ellipses).toHaveLength(1);

    const pages = c.querySelectorAll('.ct-pagination__item');
    expect(pages).toHaveLength(8);
    expect(c.querySelector('.ct-pagination__item--active .ct-pagination__item__link').textContent.trim()).toEqual('2');
    expect(c.querySelector('.ct-pagination__item--first .ct-pagination__link').getAttribute('href')).toEqual('#first');
    expect(c.querySelector('.ct-pagination__item--previous .ct-pagination__link').getAttribute('href')).toEqual('#previous');
    expect(c.querySelector('.ct-pagination__item--next .ct-pagination__link').getAttribute('href')).toEqual('#next');
    expect(c.querySelector('.ct-pagination__item--last .ct-pagination__link').getAttribute('href')).toEqual('#last');

    assertUniqueCssClasses(c);
  });

  test('does not render when items are empty', async () => {
    const c = await dom(template, {
      items: [],
    });

    expect(c.querySelectorAll('.ct-pagination')).toHaveLength(0);
  });

  test('renders current page correctly', async () => {
    const c = await dom(template, {
      items: {
        previous: { text: 'Previous', href: '#previous' },
        pages: {
          1: { href: '#1' },
          2: { href: '#2' },
          3: { href: '#3' },
        },
        next: { text: 'Next', href: '#next' },
      },
      current: '2',
    });

    const currentPage = c.querySelector('.ct-pagination__item--active .ct-pagination__item__link');
    expect(currentPage).toBeTruthy();
    expect(currentPage.textContent.trim()).toEqual('2');

    assertUniqueCssClasses(c);
  });
});
