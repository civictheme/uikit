import DrupalAttribute from '@civictheme/drupal-attribute';

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
      attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
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

  test('renders bare without a name (fail visible)', async () => {
    const c = await dom(template, {
      name: '',
    });

    expect(c.querySelectorAll('.ct-textarea')).toHaveLength(1);
    expect(c.querySelector('.ct-textarea').hasAttribute('name')).toBe(false);
  });

  test('strips HTML tags from attribute values', async () => {
    const c = await dom(template, {
      name: 'test-textarea',
      value: 'Sample text',
      attributes: new DrupalAttribute().setAttribute('data-test', '<script>alert(1)</script>'),
    });

    expect(c.querySelector('.ct-textarea').textContent.trim()).toEqual('Sample text');
    expect(c.querySelector('.ct-textarea').getAttribute('name')).toEqual('test-textarea');
    expect(c.querySelector('.ct-textarea').getAttribute('data-test')).toEqual('<script>alert(1)</script>');

    assertUniqueCssClasses(c);
  });
  test('renders from attributes only (platform-rendered control)', async () => {
    const c = await dom(template, {
      attributes: new DrupalAttribute()
        .setAttribute('name', 'platform-name')
        .setAttribute('id', 'platform-id')
        .setAttribute('data-drupal-selector', 'platform-id'),
    });

    expect(c.querySelectorAll('.ct-textarea[name="platform-name"][id="platform-id"][data-drupal-selector="platform-id"]')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });
});
