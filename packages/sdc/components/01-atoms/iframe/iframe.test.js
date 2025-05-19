const template = 'components/01-atoms/iframe/iframe.twig';

describe('Iframe Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      url: 'https://example.com',
    });

    expect(c.querySelectorAll('.ct-iframe')).toHaveLength(1);
    expect(c.querySelector('.ct-iframe').getAttribute('src')).toEqual('https://example.com');

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      url: 'https://example.com',
      width: 600,
      height: 400,
      vertical_spacing: 'both',
      with_background: true,
      attributes: 'data-test="true"',
      modifier_class: 'custom-class',
      theme: 'dark',
    });

    expect(c.querySelectorAll('.ct-iframe.custom-class.ct-theme-dark.ct-vertical-spacing-inset--both.ct-iframe--with-background')).toHaveLength(1);
    expect(c.querySelector('.ct-iframe').getAttribute('src')).toEqual('https://example.com');
    expect(c.querySelector('.ct-iframe').getAttribute('width')).toEqual('600');
    expect(c.querySelector('.ct-iframe').getAttribute('height')).toEqual('400');
    expect(c.querySelector('.ct-iframe').getAttribute('data-test')).toEqual('true');

    assertUniqueCssClasses(c);
  });
});
