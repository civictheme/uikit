const template = 'components/01-atoms/textfield/textfield.twig';

describe('Textfield Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      name: 'test-textfield',
      value: 'Sample text',
    });

    expect(c.querySelectorAll('.ct-textfield')).toHaveLength(1);
    expect(c.querySelector('.ct-textfield').getAttribute('value')).toEqual('Sample text');
    expect(c.querySelector('.ct-textfield').getAttribute('name')).toEqual('test-textfield');

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      name: 'test-textfield',
      value: 'Sample text',
      placeholder: 'Enter text here',
      is_invalid: true,
      is_disabled: true,
      is_required: true,
      attributes: 'data-test="true"',
      modifier_class: 'custom-class',
      theme: 'dark',
    });

    expect(c.querySelectorAll('.ct-textfield.custom-class.ct-theme-dark.ct-textfield--is-invalid')).toHaveLength(1);
    expect(c.querySelector('.ct-textfield').getAttribute('name')).toEqual('test-textfield');
    expect(c.querySelector('.ct-textfield').getAttribute('value')).toEqual('Sample text');
    expect(c.querySelector('.ct-textfield').getAttribute('placeholder')).toEqual('Enter text here');
    expect(c.querySelector('.ct-textfield').getAttribute('disabled')).toBe('');
    expect(c.querySelector('.ct-textfield').getAttribute('required')).toBe('');
    expect(c.querySelector('.ct-textfield').getAttribute('data-test')).toEqual('true');

    assertUniqueCssClasses(c);
  });

  test('does not render when name is empty', async () => {
    const c = await dom(template, {
      name: '',
    });

    expect(c.querySelectorAll('.ct-textfield')).toHaveLength(0);
  });

  test('strips HTML tags from attribute values', async () => {
    const c = await dom(template, {
      name: 'test-textfield',
      value: 'Sample text',
      attributes: 'data-test="<script>alert(1)</script>"',
    });

    expect(c.querySelector('.ct-textfield').getAttribute('value')).toEqual('Sample text');
    expect(c.querySelector('.ct-textfield').getAttribute('name')).toEqual('test-textfield');
    expect(c.querySelector('.ct-textfield').getAttribute('data-test')).toEqual('alert(1)');

    assertUniqueCssClasses(c);
  });
});
