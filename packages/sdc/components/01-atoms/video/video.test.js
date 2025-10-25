import DrupalAttribute from 'drupal-attribute';

const template = 'components/01-atoms/video/video.twig';

describe('Video Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      sources: [
        { url: 'https://example.com/video.mp4', type: 'video/mp4' },
      ],
    });

    expect(c.querySelectorAll('.ct-video')).toHaveLength(1);
    expect(c.querySelectorAll('source')).toHaveLength(1);
    expect(c.querySelector('source').getAttribute('src')).toEqual('https://example.com/video.mp4');
    expect(c.querySelector('source').getAttribute('type')).toEqual('video/mp4');
    expect(c.querySelector('.ct-video').textContent.trim()).toEqual("Your browser doesn't support HTML5 video.");

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      title: 'Sample Video',
      has_controls: true,
      sources: [
        { url: 'https://example.com/video.mp4', type: 'video/mp4' },
      ],
      poster: 'https://example.com/poster.jpg',
      width: '640',
      height: '360',
      fallback_text: 'Custom fallback text.',
      attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
      modifier_class: 'custom-class',
      theme: 'dark',
    });

    expect(c.querySelectorAll('.ct-video.custom-class.ct-theme-dark')).toHaveLength(1);
    expect(c.querySelector('video').getAttribute('title')).toEqual('Sample Video');
    expect(c.querySelector('video').getAttribute('controls')).not.toBeNull();
    expect(c.querySelector('video').getAttribute('poster')).toEqual('https://example.com/poster.jpg');
    expect(c.querySelector('video').getAttribute('width')).toEqual('640');
    expect(c.querySelector('video').getAttribute('height')).toEqual('360');
    expect(c.querySelector('video').getAttribute('data-test')).toEqual('true');
    expect(c.querySelector('video').textContent.trim()).toEqual('Custom fallback text.');

    assertUniqueCssClasses(c);
  });

  test('does not render when sources are empty', async () => {
    const c = await dom(template, {
      sources: [],
    });

    expect(c.querySelectorAll('.ct-video')).toHaveLength(0);
  });
});
