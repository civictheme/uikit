import DrupalAttribute from 'drupal-attribute';

const template = 'components/02-molecules/single-filter/single-filter.twig';

describe('Single Filter Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      title: 'Filter results by:',
      items: [
        { text: 'Filter 1', is_selected: true },
        { text: 'Filter 2' },
      ],
      submit_text: 'Apply filter',
    });

    expect(c.querySelectorAll('.ct-single-filter')).toHaveLength(1);
    expect(c.querySelector('.ct-single-filter__title').textContent.trim()).toEqual('Filter results by:');

    const items = c.querySelectorAll('.ct-single-filter__list .ct-chip');
    expect(items).toHaveLength(2);
    expect(items[0].textContent.trim()).toContain('Filter 1');
    expect(items[0].querySelector('input').checked).toBe(true);
    expect(items[1].textContent.trim()).toContain('Filter 2');
    expect(items[1].querySelector('input').checked).toBe(false);

    const submitButton = c.querySelector('.ct-single-filter__submit');
    expect(submitButton).toBeTruthy();
    expect(submitButton.textContent.trim()).toContain('Apply filter');

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      content_top: 'Top content',
      title: 'Filter results by:',
      items: [
        { text: 'Filter 1', is_selected: true, attributes: new DrupalAttribute().setAttribute('data-test', 'true') },
        { text: 'Filter 2' },
      ],
      submit_text: 'Apply filter',
      reset_text: 'Clear all',
      content_bottom: 'Bottom content',
      theme: 'dark',
      attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
      modifier_class: 'custom-class',
    });

    const element = c.querySelector('.ct-single-filter');
    expect(element).not.toBeNull();
    expect(element.classList.contains('ct-theme-dark')).toBe(true);
    expect(element.classList.contains('custom-class')).toBe(true);
    expect(element.getAttribute('data-test')).toEqual('true');

    expect(c.querySelector('.ct-single-filter__content-top').textContent.trim()).toEqual('Top content');
    expect(c.querySelector('.ct-single-filter__content-bottom').textContent.trim()).toEqual('Bottom content');
    expect(c.querySelector('.ct-single-filter__title').textContent.trim()).toEqual('Filter results by:');

    const items = c.querySelectorAll('.ct-single-filter__list .ct-chip');
    expect(items).toHaveLength(2);
    expect(items[0].textContent.trim()).toContain('Filter 1');
    expect(items[0].querySelector('input').checked).toBe(true);
    expect(items[1].textContent.trim()).toContain('Filter 2');
    expect(items[1].querySelector('input').checked).toBe(false);

    const submitButton = c.querySelector('.ct-single-filter__submit[type="submit"]');
    expect(submitButton).toBeTruthy();
    expect(submitButton.textContent.trim()).toContain('Apply filter');

    const resetButton = c.querySelector('.ct-single-filter__submit[type="reset"]');
    expect(resetButton).toBeTruthy();
    expect(resetButton.getAttribute('value').trim()).toContain('Clear all');

    assertUniqueCssClasses(c);
  });

  test('does not render when items are empty', async () => {
    const c = await dom(template, {
      items: [],
    });

    expect(c.querySelectorAll('.ct-single-filter')).toHaveLength(0);
  });

  test('renders with multiple selection enabled', async () => {
    const c = await dom(template, {
      title: 'Filter results by:',
      items: [
        { text: 'Filter 1', is_selected: true, name: 'filter1' },
        { text: 'Filter 2', name: 'filter2' },
      ],
      is_multiple: true,
    });

    const items = c.querySelectorAll('.ct-single-filter__list .ct-chip');
    expect(items).toHaveLength(2);
    expect(items[0].querySelector('input').getAttribute('name')).toEqual('filter1');
    expect(items[1].querySelector('input').getAttribute('name')).toEqual('filter2');

    assertUniqueCssClasses(c);
  });
});
