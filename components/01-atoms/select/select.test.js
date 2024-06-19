const template = 'components/01-atoms/select/select.twig';

describe('Select Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      name: 'test-select',
      options: [
        { type: 'option', label: 'Option 1', value: '1' },
        { type: 'option', label: 'Option 2', value: '2' },
      ],
    });

    expect(c.querySelectorAll('.ct-select')).toHaveLength(1);
    expect(c.querySelector('.ct-select').getAttribute('name')).toEqual('test-select');
    expect(c.querySelectorAll('option')).toHaveLength(2);
    expect(c.querySelector('option[value="1"]').textContent.trim()).toEqual('Option 1');
    expect(c.querySelector('option[value="2"]').textContent.trim()).toEqual('Option 2');

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      name: 'test-select',
      id: 'select-id',
      options: [
        { type: 'option', label: 'Option 1', value: '1', is_selected: true },
        { type: 'option', label: 'Option 2', value: '2' },
        { type: 'option', label: 'Option 3', value: '3', is_disabled: true },
      ],
      theme: 'dark',
      is_multiple: true,
      is_invalid: true,
      is_disabled: true,
      is_required: true,
      attributes: 'data-test="true"',
      modifier_class: 'custom-class',
    });

    expect(c.querySelectorAll('.ct-select.custom-class.ct-theme-dark.ct-select--is-invalid')).toHaveLength(1);
    expect(c.querySelector('.ct-select').getAttribute('name')).toEqual('test-select');
    expect(c.querySelector('.ct-select').getAttribute('id')).toEqual('select-id');
    expect(c.querySelector('.ct-select').hasAttribute('multiple')).toBe(true);
    expect(c.querySelector('.ct-select').hasAttribute('disabled')).toBe(true);
    expect(c.querySelector('.ct-select').hasAttribute('required')).toBe(true);
    expect(c.querySelector('.ct-select').getAttribute('data-test')).toEqual('true');
    expect(c.querySelectorAll('option')).toHaveLength(3);
    expect(c.querySelector('option[value="1"]').hasAttribute('selected')).toBe(true);
    expect(c.querySelector('option[value="1"]').textContent.trim()).toEqual('Option 1');
    expect(c.querySelector('option[value="2"]').textContent.trim()).toEqual('Option 2');
    expect(c.querySelector('option[value="3"]').textContent.trim()).toEqual('Option 3');
    expect(c.querySelector('option[value="3"]').hasAttribute('disabled')).toBe(true);

    assertUniqueCssClasses(c);
  });

  test('renders optgroup with options', async () => {
    const c = await dom(template, {
      name: 'test-select',
      options: [
        {
          type: 'optgroup',
          label: 'Group 1',
          options: [
            { label: 'Option 1.1', value: '1.1' },
            { label: 'Option 1.2', value: '1.2' },
          ],
        },
        {
          type: 'option',
          label: 'Option 2',
          value: '2',
        },
      ],
    });

    expect(c.querySelectorAll('optgroup')).toHaveLength(1);
    expect(c.querySelector('optgroup[label="Group 1"]')).not.toBeNull();
    expect(c.querySelector('optgroup[label="Group 1"] option[value="1.1"]').textContent.trim()).toEqual('Option 1.1');
    expect(c.querySelector('optgroup[label="Group 1"] option[value="1.2"]').textContent.trim()).toEqual('Option 1.2');
    expect(c.querySelectorAll('option')).toHaveLength(3); // Two in optgroup + one outside

    assertUniqueCssClasses(c);
  });

  test('does not render when name or options are empty', async () => {
    let c = await dom(template, {
      name: '',
      options: [
        { type: 'option', label: 'Option 1', value: '1' },
      ],
    });
    expect(c.querySelectorAll('.ct-select')).toHaveLength(0);

    c = await dom(template, {
      name: 'test-select',
      options: [],
    });
    expect(c.querySelectorAll('.ct-select')).toHaveLength(0);
  });

  test('strips HTML tags from attribute values', async () => {
    const c = await dom(template, {
      name: 'test-select',
      options: [
        { type: 'option', label: 'Option 1', value: '1' },
      ],
      attributes: 'data-test="<script>alert(1)</script>"',
    });

    expect(c.querySelector('.ct-select').getAttribute('data-test')).toEqual('alert(1)');

    assertUniqueCssClasses(c);
  });
});
