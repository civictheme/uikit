const template = 'components/01-atoms/textarea/textarea.twig';

describe('Textarea Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      name: 'test-textarea',
      value: 'Sample text',
    });

    expect(c.querySelectorAll('.ct-textarea')).toHaveLength(1);
    expect(c.querySelector('.ct-textarea').textContent.trim()).toEqual('Sample text');
    expect(c.querySelector('.ct-textarea').getAttribute('name')).toEqual('test-textarea');
    expect(c.querySelectorAll('.ct-textarea[type]')).toHaveLength(0);
    expect(c.querySelectorAll('.ct-textarea[value]')).toHaveLength(0);

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      name: 'test-textarea',
      value: 'Sample text',
      placeholder: 'Enter text here',
      rows: 5,
      is_invalid: true,
      is_disabled: true,
      is_required: true,
      attributes: 'data-test="true"',
      modifier_class: 'custom-class',
      theme: 'dark',
    });

    expect(c.querySelectorAll('.ct-textarea.custom-class.ct-theme-dark.ct-textarea--is-invalid')).toHaveLength(1);
    expect(c.querySelector('.ct-textarea').getAttribute('name')).toEqual('test-textarea');
    expect(c.querySelector('.ct-textarea').textContent.trim()).toEqual('Sample text');
    expect(c.querySelector('.ct-textarea').getAttribute('placeholder')).toEqual('Enter text here');
    expect(c.querySelector('.ct-textarea').getAttribute('rows')).toEqual('5');
    expect(c.querySelector('.ct-textarea').getAttribute('disabled')).toBe('');
    expect(c.querySelector('.ct-textarea').getAttribute('required')).toBe('');
    expect(c.querySelector('.ct-textarea').getAttribute('data-test')).toEqual('true');

    assertUniqueCssClasses(c);
  });

  test('does not render when name is empty', async () => {
    const c = await dom(template, {
      name: '',
    });

    expect(c.querySelectorAll('.ct-textarea')).toHaveLength(0);
  });

  test('strips HTML tags from attribute values', async () => {
    const c = await dom(template, {
      name: 'test-textarea',
      value: 'Sample text',
      attributes: 'data-test="<script>alert(1)</script>"',
    });

    expect(c.querySelector('.ct-textarea').textContent.trim()).toEqual('Sample text');
    expect(c.querySelector('.ct-textarea').getAttribute('name')).toEqual('test-textarea');
    expect(c.querySelector('.ct-textarea').getAttribute('data-test')).toEqual('alert(1)');

    assertUniqueCssClasses(c);
  });
});
