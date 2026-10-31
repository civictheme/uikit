import DrupalAttribute from '@civictheme/drupal-attribute';

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
      attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
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
    expect(c.querySelector('.ct-input').getAttribute('aria-describedby')).toEqual('input-id--error-message');

    assertUniqueCssClasses(c);
  });

  test('renders bare without a name (fail visible)', async () => {
    const c = await dom(template, {
      name: '',
      type: 'text',
    });

    expect(c.querySelectorAll('.ct-input[type="text"]')).toHaveLength(1);
    expect(c.querySelector('.ct-input').hasAttribute('name')).toBe(false);
  });

  test('strips HTML tags from attribute values', async () => {
    const c = await dom(template, {
      name: 'test-input',
      value: 'Sample text',
      type: 'text',
      attributes: new DrupalAttribute().setAttribute('data-test', '<script>alert(1)</script>'),
    });

    expect(c.querySelector('.ct-input').getAttribute('value')).toEqual('Sample text');
    expect(c.querySelector('.ct-input').getAttribute('name')).toEqual('test-input');
    expect(c.querySelector('.ct-input').getAttribute('data-test')).toEqual('<script>alert(1)</script>');

    assertUniqueCssClasses(c);
  });
  test('renders from attributes only (platform-rendered control)', async () => {
    const c = await dom(template, {
      attributes: new DrupalAttribute()
        .setAttribute('name', 'platform-name')
        .setAttribute('id', 'platform-id')
        .setAttribute('data-drupal-selector', 'platform-id'),
    });

    expect(c.querySelectorAll('.ct-input[name="platform-name"][id="platform-id"][data-drupal-selector="platform-id"]')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });
});
