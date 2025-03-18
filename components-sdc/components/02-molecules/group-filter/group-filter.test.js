const template = 'components/02-molecules/group-filter/group-filter.twig';

describe('Group Filter Component', () => {
  test('renders with default values', async () => {
    const c = await dom(template, {
      filters: [
        { title: 'Filter 1', content: 'Content 1' },
        { title: 'Filter 2', content: 'Content 2' },
      ],
    });

    expect(c.querySelectorAll('.ct-group-filter')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-group-filter .ct-group-filter__title')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-group-filter .ct-group-filter__filters .ct-popover')).toHaveLength(2);
    expect(c.querySelectorAll('.ct-group-filter .ct-group-filter__submit')).toHaveLength(1);
    expect(c.querySelector('.ct-group-filter .ct-group-filter__title').textContent.trim()).toEqual('Filter results by:');

    assertUniqueCssClasses(c);
  });

  test('renders with custom title and submit text', async () => {
    const c = await dom(template, {
      title: 'Custom Title',
      submit_text: 'Submit Filters',
      filters: [
        { title: 'Filter 1', content: 'Content 1' },
        { title: 'Filter 2', content: 'Content 2' },
      ],
    });

    expect(c.querySelectorAll('.ct-group-filter')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-group-filter .ct-group-filter__title')).toHaveLength(1);
    expect(c.querySelector('.ct-group-filter .ct-group-filter__title').textContent.trim()).toEqual('Custom Title');
    expect(c.querySelector('.ct-group-filter .ct-group-filter__submit').textContent.trim()).toContain('Submit Filters');

    assertUniqueCssClasses(c);
  });

  test('renders with content top and bottom', async () => {
    const c = await dom(template, {
      content_top: 'Top Content',
      content_bottom: 'Bottom Content',
      filters: [
        { title: 'Filter 1', content: 'Content 1' },
        { title: 'Filter 2', content: 'Content 2' },
      ],
    });

    expect(c.querySelectorAll('.ct-group-filter')).toHaveLength(1);
    expect(c.querySelector('.ct-group-filter__content-top').textContent.trim()).toEqual('Top Content');
    expect(c.querySelector('.ct-group-filter__content-bottom').textContent.trim()).toEqual('Bottom Content');

    assertUniqueCssClasses(c);
  });

  test('renders with form attributes and hidden fields', async () => {
    const c = await dom(template, {
      form_attributes: 'id="filter-form" action="/filters" method="POST"',
      form_hidden_fields: '<input type="hidden" name="token" value="12345">',
      filters: [
        { title: 'Filter 1', content: 'Content 1' },
        { title: 'Filter 2', content: 'Content 2' },
      ],
    });

    expect(c.querySelectorAll('.ct-group-filter')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-group-filter form')).toHaveLength(1);
    expect(c.querySelector('.ct-group-filter form').outerHTML).toContain('id="filter-form" action="/filters" method="POST"');
    expect(c.querySelector('.ct-group-filter form').innerHTML).toContain('<input type="hidden" name="token" value="12345">');

    assertUniqueCssClasses(c);
  });

  test('renders with custom attributes and classes', async () => {
    const c = await dom(template, {
      filters: [
        { title: 'Filter 1', content: 'Content 1' },
        { title: 'Filter 2', content: 'Content 2' },
      ],
      attributes: 'data-test="true"',
      modifier_class: 'custom-modifier',
    });

    expect(c.querySelectorAll('.ct-group-filter.custom-modifier')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-group-filter[data-test=true]')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('does not render when filters are empty', async () => {
    const c = await dom(template, {
      filters: [],
    });

    expect(c.querySelectorAll('.ct-group-filter')).toHaveLength(0);
  });
});
