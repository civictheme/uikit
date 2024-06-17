const template = 'components/01-atoms/field-description/field-description.twig';

describe('Field Description Component', () => {
  test('renders with default values', async () => {
    const c = await dom(template, {
      content: 'This is a description',
    });

    expect(c.querySelectorAll('.ct-field-description.ct-theme-light.ct-field-description--regular')).toHaveLength(1);
    expect(c.querySelector('.ct-field-description').textContent.trim()).toEqual('This is a description');

    assertUniqueCssClasses(c);
  });

  test('renders with custom theme and size', async () => {
    const c = await dom(template, {
      content: 'This is a description',
      theme: 'dark',
      size: 'large',
    });

    expect(c.querySelectorAll('.ct-field-description.ct-theme-dark.ct-field-description--large')).toHaveLength(1);
    expect(c.querySelector('.ct-field-description').textContent.trim()).toEqual('This is a description');

    assertUniqueCssClasses(c);
  });

  test('allows HTML content', async () => {
    const c = await dom(template, {
      content: '<strong>This is a description</strong>',
      allow_html: true,
    });

    expect(c.querySelectorAll('.ct-field-description.ct-theme-light.ct-field-description--regular')).toHaveLength(1);
    expect(c.querySelector('.ct-field-description').innerHTML.trim()).toEqual('<strong>This is a description</strong>');

    assertUniqueCssClasses(c);
  });

  test('strips HTML content', async () => {
    const c = await dom(template, {
      content: '<strong>This is a description</strong>',
      allow_html: false,
    });

    expect(c.querySelectorAll('.ct-field-description.ct-theme-light.ct-field-description--regular')).toHaveLength(1);
    expect(c.querySelector('.ct-field-description').textContent.trim()).toContain('This is a description');
    expect(c.querySelector('.ct-field-description').textContent.trim()).not.toContain('<strong>This is a description</strong>');

    assertUniqueCssClasses(c);
  });

  test('renders with additional attributes and classes', async () => {
    const c = await dom(template, {
      content: 'This is a description',
      attributes: 'data-test="true"',
      modifier_class: 'custom-modifier',
    });

    expect(c.querySelectorAll('.ct-field-description.ct-theme-light.ct-field-description--regular.custom-modifier')).toHaveLength(1);
    expect(c.querySelector('.ct-field-description').getAttribute('data-test')).toEqual('true');
    expect(c.querySelector('.ct-field-description').textContent.trim()).toEqual('This is a description');

    assertUniqueCssClasses(c);
  });

  test('does not render when content is empty', async () => {
    const c = await dom(template, {
      content: '',
    });

    expect(c.querySelectorAll('.ct-field-description')).toHaveLength(0);
  });
});
