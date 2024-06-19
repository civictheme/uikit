const template = 'components/01-atoms/input/input.twig';

describe('Input Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      name: 'test-input',
      value: 'Sample text',
      type: 'text',
    });

    expect(c.querySelectorAll('.ct-input')).toHaveLength(1);
    expect(c.querySelector('.ct-input').getAttribute('value')).toEqual('Sample text');
    expect(c.querySelector('.ct-input').getAttribute('name')).toEqual('test-input');
    expect(c.querySelector('.ct-input').getAttribute('type')).toEqual('text');

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      name: 'test-input',
      value: 'Sample text',
      type: 'text',
      placeholder: 'Enter text here',
      is_invalid: true,
      is_disabled: true,
      is_required: true,
      attributes: 'data-test="true"',
      modifier_class: 'custom-class',
      theme: 'dark',
      id: 'input-id',
    });

    expect(c.querySelectorAll('.ct-input.custom-class.ct-theme-dark.ct-input--is-invalid')).toHaveLength(1);
    expect(c.querySelector('.ct-input').getAttribute('name')).toEqual('test-input');
    expect(c.querySelector('.ct-input').getAttribute('value')).toEqual('Sample text');
    expect(c.querySelector('.ct-input').getAttribute('placeholder')).toEqual('Enter text here');
    expect(c.querySelector('.ct-input').getAttribute('disabled')).toBe('');
    expect(c.querySelector('.ct-input').getAttribute('required')).toBe('');
    expect(c.querySelector('.ct-input').getAttribute('data-test')).toEqual('true');
    expect(c.querySelector('.ct-input').getAttribute('id')).toEqual('input-id');

    assertUniqueCssClasses(c);
  });

  test('does not render when name is empty', async () => {
    const c = await dom(template, {
      name: '',
      type: 'text',
    });

    expect(c.querySelectorAll('.ct-input')).toHaveLength(0);
  });

  test('strips HTML tags from attribute values', async () => {
    const c = await dom(template, {
      name: 'test-input',
      value: 'Sample text',
      type: 'text',
      attributes: 'data-test="<script>alert(1)</script>"',
    });

    expect(c.querySelector('.ct-input').getAttribute('value')).toEqual('Sample text');
    expect(c.querySelector('.ct-input').getAttribute('name')).toEqual('test-input');
    expect(c.querySelector('.ct-input').getAttribute('data-test')).toEqual('<script>alert(1)</script>');

    assertUniqueCssClasses(c);
  });
});
