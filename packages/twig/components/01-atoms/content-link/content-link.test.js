import DrupalAttribute from 'drupal-attribute';

const template = 'components/01-atoms/content-link/content-link.twig';

describe('Content Link Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      text: 'Sample Link',
      url: 'https://example.com',
    });

    expect(c.querySelectorAll('.ct-content-link')).toHaveLength(1);
    expect(c.querySelector('.ct-content-link').textContent.trim()).toEqual('Sample Link');
    expect(c.querySelector('.ct-content-link').getAttribute('href')).toEqual('https://example.com');

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      text: 'Sample Link',
      url: 'https://example.com',
      title: 'Example Title',
      is_new_window: true,
      is_external: true,
      attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
      modifier_class: 'custom-class',
      theme: 'dark',
    });

    expect(c.querySelectorAll('.ct-content-link.custom-class.ct-theme-dark.ct-content-link--external')).toHaveLength(1);
    expect(c.querySelector('.ct-content-link').textContent.trim()).toContain('Sample Link');
    expect(c.querySelector('.ct-content-link').getAttribute('href')).toEqual('https://example.com');
    expect(c.querySelector('.ct-content-link').getAttribute('title')).toEqual('Example Title');
    expect(c.querySelector('.ct-content-link').getAttribute('target')).toEqual('_blank');
    expect(c.querySelector('.ct-content-link').getAttribute('aria-label')).toEqual('Opens in a new tab');
    expect(c.querySelector('.ct-content-link').getAttribute('data-test')).toEqual('true');
    expect(c.querySelector('.ct-content-link').textContent.trim()).toContain('(Opens in a new tab/window)');

    assertUniqueCssClasses(c);
  });

  test('does not render when text is empty', async () => {
    const c = await dom(template, {
      text: '',
    });

    expect(c.querySelectorAll('.ct-content-link')).toHaveLength(0);
  });
});
