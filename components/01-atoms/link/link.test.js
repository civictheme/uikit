const template = 'components/01-atoms/link/link.twig';

describe('Link Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      text: 'Sample Link',
      url: 'https://example.com',
    });

    expect(c.querySelectorAll('.ct-link')).toHaveLength(1);
    expect(c.querySelector('.ct-link').textContent.trim()).toEqual('Sample Link');
    expect(c.querySelector('.ct-link').getAttribute('href')).toEqual('https://example.com');

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes, not external', async () => {
    const c = await dom(template, {
      text: 'Sample Link',
      url: 'https://example.com',
      title: 'Example Title',
      is_new_window: true,
      is_external: false,
      is_active: true,
      is_disabled: true,
      icon: 'call',
      icon_placement: 'before',
      attributes: 'data-test="true"',
      modifier_class: 'custom-class',
      theme: 'dark',
    });

    expect(c.querySelectorAll('.ct-link.custom-class.ct-theme-dark.ct-link--active.ct-link--disabled')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-link.custom-class.ct-theme-dark.ct-link--external.ct-link--active.ct-link--disabled')).toHaveLength(0);
    expect(c.querySelector('.ct-link').textContent.trim()).toContain('Sample Link');
    expect(c.querySelector('.ct-link').getAttribute('href')).toEqual('https://example.com');
    expect(c.querySelector('.ct-link').getAttribute('title')).toEqual('Example Title');
    expect(c.querySelector('.ct-link').getAttribute('target')).toEqual('_blank');
    expect(c.querySelector('.ct-link').getAttribute('aria-label')).toEqual('Opens in a new tab');
    expect(c.querySelector('.ct-link').getAttribute('data-test')).toEqual('true');
    expect(c.querySelectorAll('.ct-link .ct-link__icon')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes, is external', async () => {
    const c = await dom(template, {
      text: 'Sample Link',
      url: 'https://example.com',
      title: 'Example Title',
      is_new_window: true,
      is_external: true,
      is_active: true,
      is_disabled: true,
      icon: 'call',
      icon_placement: 'before',
      attributes: 'data-test="true"',
      modifier_class: 'custom-class',
      theme: 'dark',
    });

    expect(c.querySelectorAll('.ct-link.custom-class.ct-theme-dark.ct-link--external.ct-link--active.ct-link--disabled')).toHaveLength(1);
    expect(c.querySelector('.ct-link').textContent.trim()).toContain('Sample Link');
    expect(c.querySelector('.ct-link').getAttribute('href')).toEqual('https://example.com');
    expect(c.querySelector('.ct-link').getAttribute('title')).toEqual('Example Title');
    expect(c.querySelector('.ct-link').getAttribute('target')).toEqual('_blank');
    expect(c.querySelector('.ct-link').getAttribute('aria-label')).toEqual('Opens in a new tab');
    expect(c.querySelector('.ct-link').getAttribute('data-test')).toEqual('true');
    expect(c.querySelectorAll('.ct-link .ct-link__icon')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('does not render when text and icon are empty', async () => {
    const c = await dom(template, {
      text: '',
      icon: '',
    });

    expect(c.querySelectorAll('.ct-link')).toHaveLength(0);
  });
});
