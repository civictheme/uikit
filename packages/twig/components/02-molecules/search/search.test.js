import DrupalAttribute from 'drupal-attribute';

const template = 'components/02-molecules/search/search.twig';

describe('Search Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      text: 'Search',
      url: 'https://example.com/search',
    });

    expect(c.querySelectorAll('.ct-search')).toHaveLength(1);
    const link = c.querySelector('.ct-search__link');
    expect(link).toBeTruthy();
    expect(link.textContent.trim()).toContain('Search');
    expect(link.getAttribute('href')).toEqual('https://example.com/search');
    expect(link.querySelector('.ct-link__icon')).toBeTruthy();

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      text: 'Search',
      url: 'https://example.com/search',
      theme: 'dark',
      attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
      modifier_class: 'custom-class',
    });

    const element = c.querySelector('.ct-search');
    expect(element).not.toBeNull();
    expect(element.classList.contains('ct-theme-dark')).toBe(true);
    expect(element.classList.contains('custom-class')).toBe(true);
    expect(element.getAttribute('data-test')).toEqual('true');

    const link = c.querySelector('.ct-search__link');
    expect(link).toBeTruthy();
    expect(link.textContent.trim()).toContain('Search');
    expect(link.getAttribute('href')).toEqual('https://example.com/search');
    expect(link.querySelector('.ct-link__icon')).toBeTruthy();

    assertUniqueCssClasses(c);
  });

  test('renders with URL only', async () => {
    const c = await dom(template, {
      text: 'Search',
      url: 'https://example.com/search',
    });

    const link = c.querySelector('.ct-search__link');
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toEqual('https://example.com/search');

    assertUniqueCssClasses(c);
  });
});
