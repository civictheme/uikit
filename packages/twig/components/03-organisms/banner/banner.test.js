import DrupalAttribute from 'drupal-attribute';

const template = 'components/03-organisms/banner/banner.twig';

describe('Banner Component', () => {
  test('renders with only required attributes', async () => {
    const c = await dom(template, {
      title: 'Banner Title',
    });

    expect(c.querySelectorAll('.ct-banner')).toHaveLength(1);
    expect(c.querySelector('.ct-banner__title').textContent.trim()).toBe('Banner Title');

    assertUniqueCssClasses(c);
  });

  test('renders with all attributes provided', async () => {
    const c = await dom(template, {
      content_top1: 'Top Content 1',
      breadcrumb: {
        links: [{ text: 'Home', url: '/' }, { text: 'Section', url: '/section' }],
        active_is_link: true,
      },
      content_top2: 'Top Content 2',
      content_top3: 'Top Content 3',
      content_middle: 'Middle Content',
      content: 'Main Content',
      content_bottom: 'Bottom Content',
      content_below: 'Below Content',
      site_section: 'Site Section',
      title: 'Banner Title',
      is_decorative: true,
      featured_image: {
        url: 'https://example.com/image.jpg',
        alt: 'Featured Image',
      },
      background_image: {
        url: 'https://example.com/background.jpg',
        alt: 'Background Image',
      },
      background_image_blend_mode: 'multiply',
      theme: 'dark',
      modifier_class: 'additional-class',
      attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
    });

    expect(c.querySelectorAll('.ct-banner')).toHaveLength(1);
    expect(c.querySelector('.ct-banner').classList).toContain('ct-theme-dark');
    expect(c.querySelector('.ct-banner').classList).toContain('ct-banner--decorative');
    expect(c.querySelector('.ct-banner').classList).toContain('additional-class');
    expect(c.querySelector('.ct-banner__title').textContent.trim()).toBe('Banner Title');
    expect(c.querySelector('.ct-banner__content-top').textContent.trim()).toBe('Top Content 1');
    expect(c.querySelector('.ct-banner__content-top2').textContent.trim()).toBe('Top Content 2');
    expect(c.querySelector('.ct-banner__content-top3').textContent.trim()).toBe('Top Content 3');
    expect(c.querySelector('.ct-banner__content-middle').textContent.trim()).toBe('Middle Content');
    expect(c.querySelector('.ct-banner__content').textContent.trim()).toBe('Main Content');
    expect(c.querySelector('.ct-banner__content-bottom').textContent.trim()).toBe('Bottom Content');
    expect(c.querySelector('.ct-banner__content-below').textContent.trim()).toBe('Below Content');
    expect(c.querySelector('.ct-banner__site-section').textContent.trim()).toBe('Site Section');
    expect(c.querySelector('.ct-banner').getAttribute('data-test')).toBe('true');

    const backgroundImageElement = c.querySelector('.ct-banner__inner');
    expect(backgroundImageElement.style.backgroundImage).toContain('https://example.com/background.jpg');
    expect(backgroundImageElement.classList).toContain('ct-background--multiply');

    const featuredImageElement = c.querySelector('.ct-banner__featured-image');
    expect(featuredImageElement.getAttribute('src')).toContain('https://example.com/image.jpg');
    expect(featuredImageElement.getAttribute('alt')).toBe('Featured Image');

    assertUniqueCssClasses(c);
  });

  test('renders without additional attributes and classes', async () => {
    const c = await dom(template, {
      title: 'Banner Title',
      theme: 'light',
      modifier_class: '',
    });

    expect(c.querySelectorAll('.ct-banner')).toHaveLength(1);
    expect(c.querySelector('.ct-banner').classList).toContain('ct-theme-light');
    expect(c.querySelector('.ct-banner').classList).not.toContain('ct-banner--decorative');
    expect(c.querySelector('.ct-banner').classList).not.toContain('additional-class');
    expect(c.querySelector('.ct-banner__title').textContent.trim()).toBe('Banner Title');

    assertUniqueCssClasses(c);
  });

  test('does not render when all content slots are empty', async () => {
    const c = await dom(template, {});

    expect(c.querySelectorAll('.ct-banner')).toHaveLength(0);
  });
});
