const template = 'components/01-atoms/fieldset/fieldset.twig';

describe('Fieldset Component', () => {
  test('renders with default values', async () => {
    const c = await dom(template);

    expect(c.querySelectorAll('.ct-fieldset.ct-theme-light')).toHaveLength(1);
    assertUniqueCssClasses(c);
  });

  test('renders with legend', async () => {
    const c = await dom(template, {
      legend: 'Test Legend',
    });

    expect(c.querySelectorAll('.ct-fieldset .ct-fieldset__legend')).toHaveLength(1);
    expect(c.querySelector('.ct-fieldset .ct-fieldset__legend').textContent.trim()).toEqual('Test Legend');
    assertUniqueCssClasses(c);
  });

  test('renders with description before', async () => {
    const c = await dom(template, {
      description: 'Test Description',
      description_display: 'before',
    });

    expect(c.querySelectorAll('.ct-fieldset .ct-fieldset__description--before')).toHaveLength(1);
    expect(c.querySelector('.ct-fieldset .ct-fieldset__description--before').textContent.trim()).toEqual('Test Description');
    assertUniqueCssClasses(c);
  });

  test('renders with description after', async () => {
    const c = await dom(template, {
      description: 'Test Description',
      description_display: 'after',
    });

    expect(c.querySelectorAll('.ct-fieldset .ct-fieldset__description--after')).toHaveLength(1);
    expect(c.querySelector('.ct-fieldset .ct-fieldset__description--after').textContent.trim()).toEqual('Test Description');
    assertUniqueCssClasses(c);
  });

  test('renders with invisible description', async () => {
    const c = await dom(template, {
      description: 'Test Description',
      description_display: 'invisible',
    });

    expect(c.querySelectorAll('.ct-fieldset .ct-fieldset__description--invisible.ct-visually-hidden')).toHaveLength(1);
    expect(c.querySelector('.ct-fieldset .ct-fieldset__description--invisible.ct-visually-hidden').textContent.trim()).toEqual('Test Description');
    assertUniqueCssClasses(c);
  });

  test('renders with message', async () => {
    const c = await dom(template, {
      message: 'Test Message',
      message_type: 'warning',
    });

    expect(c.querySelectorAll('.ct-fieldset .ct-fieldset__message')).toHaveLength(1);
    expect(c.querySelector('.ct-fieldset .ct-fieldset__message').textContent.trim()).toEqual('Test Message');
    assertUniqueCssClasses(c);
  });

  test('renders with fields', async () => {
    const c = await dom(template, {
      fields: '<div class="test-field">Test Field</div>',
    });

    expect(c.querySelectorAll('.ct-fieldset .ct-fieldset__fields')).toHaveLength(1);
    expect(c.querySelector('.ct-fieldset .ct-fieldset__fields').innerHTML.trim()).toEqual('<div class="test-field">Test Field</div>');
    assertUniqueCssClasses(c);
  });

  test('renders with prefix and suffix', async () => {
    const c = await dom(template, {
      prefix: '<div class="test-prefix">Prefix</div>',
      suffix: '<div class="test-suffix">Suffix</div>',
    });

    expect(c.querySelectorAll('.ct-fieldset .ct-fieldset__prefix')).toHaveLength(1);
    expect(c.querySelector('.ct-fieldset .ct-fieldset__prefix').innerHTML.trim()).toContain('Prefix');

    expect(c.querySelectorAll('.ct-fieldset .ct-fieldset__suffix')).toHaveLength(1);
    expect(c.querySelector('.ct-fieldset .ct-fieldset__suffix').innerHTML.trim()).toContain('Suffix');

    assertUniqueCssClasses(c);
  });

  test('renders with additional attributes and classes', async () => {
    const c = await dom(template, {
      attributes: 'data-test="true"',
      modifier_class: 'custom-modifier',
    });

    expect(c.querySelectorAll('.ct-fieldset.custom-modifier')).toHaveLength(1);
    expect(c.querySelector('.ct-fieldset').getAttribute('data-test')).toEqual('true');
    assertUniqueCssClasses(c);
  });
});
