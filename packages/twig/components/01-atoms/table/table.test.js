const template = 'components/01-atoms/table/table.twig';

describe('Table Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      rows: [
        ['Row 1, Col 1', 'Row 1, Col 2'],
        ['Row 2, Col 1', 'Row 2, Col 2'],
      ],
    });

    expect(c.querySelectorAll('.ct-table')).toHaveLength(1);
    expect(c.querySelectorAll('tbody tr')).toHaveLength(2);
    expect(c.querySelector('tbody tr').textContent.trim()).toContain('Row 1, Col 1');
    expect(c.querySelector('tbody tr').textContent.trim()).toContain('Row 1, Col 2');

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      caption: 'Sample Table Caption',
      caption_position: 'after',
      header: ['Header 1', 'Header 2'],
      rows: [
        ['Row 1, Col 1', 'Row 1, Col 2'],
        ['Row 2, Col 1', 'Row 2, Col 2'],
      ],
      footer: ['Footer 1', 'Footer 2'],
      is_striped: true,
      attributes: 'data-test="true"',
      modifier_class: 'custom-class',
      theme: 'dark',
    });

    expect(c.querySelectorAll('.ct-table.custom-class.ct-theme-dark.ct-table--caption-after.ct-table--striped')).toHaveLength(1);
    expect(c.querySelector('caption').textContent.trim()).toEqual('Sample Table Caption');
    expect(c.querySelectorAll('thead tr th')).toHaveLength(2);
    expect(c.querySelector('thead tr th').textContent.trim()).toContain('Header 1');
    expect(c.querySelectorAll('tbody tr')).toHaveLength(2);
    expect(c.querySelector('tbody tr').textContent.trim()).toContain('Row 1, Col 1');
    expect(c.querySelector('tfoot tr th').textContent.trim()).toContain('Footer 1');
    expect(c.querySelector('.ct-table').getAttribute('data-test')).toEqual('true');

    assertUniqueCssClasses(c);
  });

  test('does not render when all content arrays are empty', async () => {
    const c = await dom(template, {
      rows: [],
      header: [],
      footer: [],
      caption: '',
    });

    expect(c.querySelectorAll('.ct-table')).toHaveLength(0);
  });
});
