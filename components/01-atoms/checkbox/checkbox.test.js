const template = 'components/01-atoms/checkbox/checkbox.twig';

describe('Checkbox Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      name: 'test-checkbox',
      id: 'test-checkbox-id',
    });

    expect(c.querySelectorAll('.ct-checkbox')).toHaveLength(1);
    expect(c.querySelector('.ct-checkbox').getAttribute('name')).toBe('test-checkbox');
    expect(c.querySelector('.ct-checkbox').getAttribute('id')).toBe('test-checkbox-id');
    expect(c.querySelector('.ct-checkbox').getAttribute('type')).toBe('checkbox');
    expect(c.querySelector('.ct-checkbox').checked).toBe(false);
    expect(c.querySelector('.ct-checkbox').disabled).toBe(false);

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      name: 'test-checkbox',
      id: 'test-checkbox-id',
      value: 'test-value',
      label: 'Test Label',
      is_checked: true,
      is_invalid: true,
      is_disabled: true,
      attributes: 'data-test="true"',
      modifier_class: 'custom-class',
      theme: 'dark',
    });

    expect(c.querySelectorAll('.ct-checkbox.ct-theme-dark.ct-checkbox--is-invalid.custom-class')).toHaveLength(1);
    expect(c.querySelector('.ct-checkbox').getAttribute('name')).toBe('test-checkbox');
    expect(c.querySelector('.ct-checkbox').getAttribute('id')).toBe('test-checkbox-id');
    expect(c.querySelector('.ct-checkbox').getAttribute('value')).toBe('test-value');
    expect(c.querySelector('.ct-checkbox').checked).toBe(true);
    expect(c.querySelector('.ct-checkbox').disabled).toBe(true);
    expect(c.querySelector('.ct-checkbox').getAttribute('data-test')).toBe('true');

    const label = c.querySelector('.ct-checkbox__label');
    expect(label).not.toBeNull();
    expect(label.textContent.trim()).toBe('Test Label');
    expect(label.getAttribute('for')).toBe('test-checkbox-id');

    assertUniqueCssClasses(c);
  });

  test('does not render when name or id is empty', async () => {
    const c1 = await dom(template, {
      name: '',
      id: 'test-checkbox-id',
    });
    expect(c1.querySelectorAll('.ct-checkbox')).toHaveLength(0);

    const c2 = await dom(template, {
      name: 'test-checkbox',
      id: '',
    });
    expect(c2.querySelectorAll('.ct-checkbox')).toHaveLength(0);
  });
});
