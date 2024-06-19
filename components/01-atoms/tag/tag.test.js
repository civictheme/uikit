const template = 'components/01-atoms/tag/tag.twig';

describe('Tag Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      content: 'Sample Tag',
    });

    expect(c.querySelectorAll('.ct-tag')).toHaveLength(1);
    expect(c.querySelector('.ct-tag').textContent.trim()).toEqual('Sample Tag');

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      content: 'Sample Tag',
      type: 'secondary',
      icon: 'call',
      icon_placement: 'before',
      url: 'https://example.com',
      is_new_window: true,
      is_external: true,
      attributes: 'data-test="true"',
      modifier_class: 'custom-class',
      theme: 'dark',
    });

    expect(c.querySelectorAll('.ct-tag.custom-class.ct-theme-dark.ct-tag--secondary.ct-tag--with-icon.ct-tag--icon-before.ct-tag--external')).toHaveLength(1);
    expect(c.querySelector('.ct-tag').textContent.trim()).toContain('Sample Tag');
    expect(c.querySelector('.ct-tag').getAttribute('href')).toEqual('https://example.com');
    expect(c.querySelector('.ct-tag').getAttribute('target')).toEqual('_blank');
    expect(c.querySelector('.ct-tag').getAttribute('aria-label')).toEqual('Opens in a new tab');
    expect(c.querySelector('.ct-tag').getAttribute('data-test')).toEqual('true');
    expect(c.querySelector('.ct-tag .ct-tag__icon')).toBeTruthy();

    assertUniqueCssClasses(c);
  });

  test('does not render when content is empty', async () => {
    const c = await dom(template, {
      content: '',
    });

    expect(c.querySelectorAll('.ct-tag')).toHaveLength(0);
  });
});
