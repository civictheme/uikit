const template = 'components/03-organisms/list/list.twig';

describe('List Component', () => {
  test('renders with all attributes provided', async () => {
    const c = await dom(template, {
      title: 'Sample Title',
      link_above: {
        text: 'Link Above',
        url: 'https://example.com',
        is_new_window: false,
        is_external: false,
      },
      filters: 'Sample Filters',
      results_count: '10 Results',
      rows_above: 'Rows Above',
      rows: 'Rows Content',
      rows_below: 'Rows Below',
      empty: '',
      pagination: 'Pagination Content',
      footer: 'Footer Content',
      link_below: {
        text: 'Link Below',
        url: 'https://example.com',
        is_new_window: false,
        is_external: false,
      },
      theme: 'dark',
      vertical_spacing: 'both',
      with_background: true,
      attributes: 'data-test="true"',
      modifier_class: 'additional-class',
    });

    expect(c.querySelectorAll('.ct-list')).toHaveLength(1);
    expect(c.querySelector('.ct-list').classList).toContain('ct-theme-dark');
    expect(c.querySelector('.ct-list').classList).toContain('ct-list--with-background');
    expect(c.querySelector('.ct-list').classList).toContain('ct-vertical-spacing-inset--both');
    expect(c.querySelector('.ct-list').classList).toContain('additional-class');
    expect(c.querySelector('.ct-list__title').textContent.trim()).toBe('Sample Title');
    expect(c.querySelector('.ct-list__link-above__link').textContent.trim()).toBe('Link Above');
    expect(c.querySelector('.ct-list__filters').textContent.trim()).toBe('Sample Filters');
    expect(c.querySelector('.ct-list__results-count').textContent.trim()).toBe('10 Results');
    expect(c.querySelector('.ct-list__rows-above').textContent.trim()).toBe('Rows Above');
    expect(c.querySelector('.ct-list__rows').textContent.trim()).toBe('Rows Content');
    expect(c.querySelector('.ct-list__rows-below').textContent.trim()).toBe('Rows Below');
    expect(c.querySelector('.ct-list__pagination').textContent.trim()).toBe('Pagination Content');
    expect(c.querySelector('.ct-list__footer').textContent.trim()).toBe('Footer Content');
    expect(c.querySelector('.ct-list__link-below__link').textContent.trim()).toBe('Link Below');
    expect(c.querySelector('.ct-list').getAttribute('data-test')).toBe('true');

    assertUniqueCssClasses(c);
  });

  test('renders with some attributes missing', async () => {
    const c = await dom(template, {
      title: '',
      link_above: null,
      filters: '',
      results_count: '',
      rows_above: '',
      rows: '',
      rows_below: '',
      empty: 'No results found',
      pagination: '',
      footer: '',
      link_below: null,
      theme: 'light',
      vertical_spacing: '',
      with_background: false,
      attributes: '',
      modifier_class: '',
    });

    expect(c.querySelectorAll('.ct-list')).toHaveLength(1);
    expect(c.querySelector('.ct-list').classList).toContain('ct-theme-light');
    expect(c.querySelector('.ct-list').classList).not.toContain('ct-list--with-background');
    expect(c.querySelector('.ct-list').classList).not.toContain('ct-vertical-spacing-inset--both');
    expect(c.querySelector('.ct-list__title')).toBeNull();
    expect(c.querySelector('.ct-list__link-above__link')).toBeNull();
    expect(c.querySelector('.ct-list__filters')).toBeNull();
    expect(c.querySelector('.ct-list__results-count')).toBeNull();
    expect(c.querySelector('.ct-list__rows-above')).toBeNull();
    expect(c.querySelector('.ct-list__rows')).toBeNull();
    expect(c.querySelector('.ct-list__rows-below')).toBeNull();
    expect(c.querySelector('.ct-list__pagination')).toBeNull();
    expect(c.querySelector('.ct-list__footer')).toBeNull();
    expect(c.querySelector('.ct-list__link-below__link')).toBeNull();
    expect(c.querySelector('.ct-list__empty-results__inner').textContent.trim()).toBe('No results found');

    assertUniqueCssClasses(c);
  });
});
