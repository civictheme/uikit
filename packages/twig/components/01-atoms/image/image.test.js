import DrupalAttribute from 'drupal-attribute';

const template = 'components/01-atoms/image/image.twig';

describe('Image Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      url: 'https://example.com/image.jpg',
    });

    expect(c.querySelectorAll('.ct-image')).toHaveLength(1);
    expect(c.querySelector('.ct-image').getAttribute('src')).toEqual('https://example.com/image.jpg');

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      url: 'https://example.com/image.jpg',
      alt: 'Sample Image',
      width: '600',
      height: '400',
      attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
      modifier_class: 'custom-class',
      theme: 'dark',
    });

    expect(c.querySelectorAll('.ct-image.custom-class.ct-theme-dark')).toHaveLength(1);
    expect(c.querySelector('.ct-image').getAttribute('src')).toEqual('https://example.com/image.jpg');
    expect(c.querySelector('.ct-image').getAttribute('alt')).toEqual('Sample Image');
    expect(c.querySelector('.ct-image').getAttribute('width')).toEqual('600');
    expect(c.querySelector('.ct-image').getAttribute('height')).toEqual('400');
    expect(c.querySelector('.ct-image').getAttribute('data-test')).toEqual('true');

    assertUniqueCssClasses(c);
  });

  test('does not render when url is empty', async () => {
    const c = await dom(template, {
      url: '',
    });

    expect(c.querySelectorAll('.ct-image')).toHaveLength(0);
  });
});
