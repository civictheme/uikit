import DrupalAttribute from 'drupal-attribute';

const template = 'components/02-molecules/basic-content/basic-content.twig';

describe('Basic Content Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      content: 'This is basic content.',
    });

    expect(c.querySelectorAll('.ct-basic-content')).toHaveLength(1);
    expect(c.querySelector('.ct-basic-content').textContent.trim()).toEqual('This is basic content.');

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      content: 'This is basic content with options.',
      theme: 'dark',
      is_contained: true,
      vertical_spacing: 'both',
      with_background: true,
      attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
      modifier_class: 'custom-class',
    });

    const element = c.querySelector('.ct-basic-content');
    expect(element).not.toBeNull();
    expect(element.classList.contains('ct-theme-dark')).toBe(true);
    expect(element.classList.contains('ct-vertical-spacing-inset--both')).toBe(true);
    expect(element.classList.contains('ct-basic-content--with-background')).toBe(true);
    expect(element.classList.contains('custom-class')).toBe(true);
    expect(element.getAttribute('data-test')).toEqual('true');
    expect(element.textContent.trim()).toEqual('This is basic content with options.');

    assertUniqueCssClasses(c);
  });

  test('renders without containment', async () => {
    const c = await dom(template, {
      content: 'This content is not contained.',
      is_contained: false,
    });

    expect(c.querySelector('.ct-basic-content .container')).toBeNull();
    expect(c.querySelector('.ct-basic-content').textContent.trim()).toEqual('This content is not contained.');

    assertUniqueCssClasses(c);
  });

  test('does not render when content is empty', async () => {
    const c = await dom(template, {
      content: '',
    });

    expect(c.querySelectorAll('.ct-basic-content')).toHaveLength(0);
  });
});
