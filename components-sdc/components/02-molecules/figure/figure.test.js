const template = 'components/02-molecules/figure/figure.twig';

describe('Figure Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      url: 'https://example.com/image.jpg',
      alt: 'Image description',
    });

    expect(c.querySelectorAll('.ct-figure')).toHaveLength(1);
    const image = c.querySelector('.ct-figure__image');
    expect(image).toBeTruthy();
    expect(image.getAttribute('src')).toEqual('https://example.com/image.jpg');
    expect(image.getAttribute('alt')).toEqual('Image description');

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      url: 'https://example.com/image.jpg',
      alt: 'Image description',
      width: '500',
      height: '300',
      caption: 'This is the image caption.',
      theme: 'dark',
      attributes: 'data-test="true"',
      modifier_class: 'custom-class',
    });

    const element = c.querySelector('.ct-figure');
    expect(element).not.toBeNull();
    expect(element.classList.contains('ct-theme-dark')).toBe(true);
    expect(element.classList.contains('custom-class')).toBe(true);
    expect(element.getAttribute('data-test')).toEqual('true');

    const image = c.querySelector('.ct-figure__image');
    expect(image).toBeTruthy();
    expect(image.getAttribute('src')).toEqual('https://example.com/image.jpg');
    expect(image.getAttribute('alt')).toEqual('Image description');
    expect(image.getAttribute('width')).toEqual('500');
    expect(image.getAttribute('height')).toEqual('300');

    const caption = c.querySelector('.ct-figure__caption');
    expect(caption).toBeTruthy();
    expect(caption.textContent.trim()).toEqual('This is the image caption.');

    assertUniqueCssClasses(c);
  });

  test('does not render when URL is empty', async () => {
    const c = await dom(template, {
      url: '',
    });

    expect(c.querySelectorAll('.ct-figure')).toHaveLength(0);
  });
});
