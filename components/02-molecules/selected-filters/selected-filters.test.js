const template = 'components/02-molecules/selected-filters/selected-filters.twig';

describe('Selected Filters Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      title: 'Selected filters:',
      filters: [
        {
          text: 'Category: News',
          url: '#',
          label: 'Remove filter: Category News',
        },
        {
          text: 'Topic: Technology',
          url: '#',
          label: 'Remove filter: Topic Technology',
        },
      ],
    });

    expect(c.querySelectorAll('.ct-selected-filters')).toHaveLength(1);
    expect(c.querySelector('.ct-selected-filters__title').textContent.trim()).toEqual('Selected filters:');

    const items = c.querySelectorAll('.ct-selected-filters__list .ct-chip');
    expect(items).toHaveLength(2);
    expect(items[0].textContent.trim()).toContain('Category: News');
    expect(items[0].getAttribute('href')).toEqual('#');
    expect(items[0].getAttribute('alt')).toEqual('Remove filter: Category News');
    expect(items[1].textContent.trim()).toContain('Topic: Technology');
    expect(items[1].getAttribute('href')).toEqual('#');
    expect(items[1].getAttribute('alt')).toEqual('Remove filter: Topic Technology');

    assertUniqueCssClasses(c);
  });

  test('renders with clear all link', async () => {
    const c = await dom(template, {
      title: 'Selected filters:',
      filters: [
        {
          text: 'Category: News',
          url: '#',
          label: 'Remove filter: Category News',
        },
      ],
      clear_link: {
        text: 'Clear all',
        url: '#clear',
        type: 'secondary',
      },
    });

    const clearButton = c.querySelector('.ct-selected-filters__clear .ct-button');
    expect(clearButton).toBeTruthy();
    expect(clearButton.textContent.trim()).toContain('Clear all');
    expect(clearButton.getAttribute('href')).toEqual('#clear');
    expect(clearButton.classList.contains('ct-button--secondary')).toBe(true);
    expect(clearButton.classList.contains('ct-button--regular')).toBe(true);

    assertUniqueCssClasses(c);
  });

  test('renders with dark theme', async () => {
    const c = await dom(template, {
      theme: 'dark',
      title: 'Selected filters:',
      filters: [
        {
          text: 'Category: News',
          url: '#',
          label: 'Remove filter: Category News',
        },
      ],
    });

    expect(c.querySelector('.ct-selected-filters').classList.contains('ct-theme-dark')).toBe(true);
    expect(c.querySelector('.ct-chip').classList.contains('ct-theme-dark')).toBe(true);

    assertUniqueCssClasses(c);
  });

  test('renders empty when no filters provided', async () => {
    const c = await dom(template, {
      title: 'Selected filters:',
      filters: [],
    });

    expect(c.querySelector('.ct-selected-filters__list .ct-chip')).toBeFalsy();
    expect(c.querySelector('.ct-selected-filters__clear')).toBeFalsy();

    assertUniqueCssClasses(c);
  });
});
