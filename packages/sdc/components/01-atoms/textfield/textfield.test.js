import DrupalAttribute from '@civictheme/drupal-attribute';

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
      attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
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

  test('renders bare without a name (fail visible)', async () => {
    const c = await dom(template, {
      name: '',
    });

    expect(c.querySelectorAll('.ct-textfield')).toHaveLength(1);
    expect(c.querySelector('.ct-textfield').hasAttribute('name')).toBe(false);
  });

  test('renders from attributes only (platform-rendered control)', async () => {
    const c = await dom(template, {
      attributes: new DrupalAttribute()
        .setAttribute('name', 'platform-name')
        .setAttribute('id', 'platform-id')
        .setAttribute('data-drupal-selector', 'platform-id'),
    });

    expect(c.querySelectorAll('.ct-textfield[name="platform-name"][id="platform-id"][data-drupal-selector="platform-id"]')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('strips HTML tags from attribute values', async () => {
    const c = await dom(template, {
      name: 'test-textfield',
      value: 'Sample text',
      attributes: new DrupalAttribute().setAttribute('data-test', '<script>alert(1)</script>'),
    });

    expect(c.querySelector('.ct-textfield').getAttribute('value')).toEqual('Sample text');
    expect(c.querySelector('.ct-textfield').getAttribute('name')).toEqual('test-textfield');
    expect(c.querySelector('.ct-textfield').getAttribute('data-test')).toEqual('<script>alert(1)</script>');

    assertUniqueCssClasses(c);
  });
});
