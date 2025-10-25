import DrupalAttribute from 'drupal-attribute';

const template = 'components/03-organisms/promo/promo.twig';

describe('Promo Component', () => {
  test('renders with only required attributes', async () => {
    const c = await dom(template, {
      title: 'Promo Title',
      content: 'Promo content text.',
    });

    expect(c.querySelectorAll('.ct-promo')).toHaveLength(1);
    expect(c.querySelector('.ct-promo__title').textContent.trim()).toBe('Promo Title');
    expect(c.querySelector('.ct-promo__content').textContent.trim()).toBe('Promo content text.');

    assertUniqueCssClasses(c);
  });

  test('renders with all attributes provided', async () => {
    const c = await dom(template, {
      content_top: 'Top Content',
      title: 'Promo Title',
      content: 'Promo content text.',
      is_contained: true,
      link: {
        text: 'Learn More',
        url: 'https://example.com',
        is_new_window: true,
        is_external: true,
      },
      content_bottom: 'Bottom Content',
      theme: 'dark',
      vertical_spacing: 'both',
      with_background: true,
      attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
      modifier_class: 'additional-class',
    });

    expect(c.querySelectorAll('.ct-promo')).toHaveLength(1);
    expect(c.querySelector('.ct-promo').classList).toContain('ct-theme-dark');
    expect(c.querySelector('.ct-promo').classList).toContain('ct-promo--with-background');
    expect(c.querySelector('.ct-promo').classList).toContain('ct-vertical-spacing--both');
    expect(c.querySelector('.ct-promo').classList).toContain('additional-class');
    expect(c.querySelector('.ct-promo__content-top').textContent.trim()).toBe('Top Content');
    expect(c.querySelector('.ct-promo__title').textContent.trim()).toBe('Promo Title');
    expect(c.querySelector('.ct-promo__content').textContent.trim()).toBe('Promo content text.');
    expect(c.querySelector('.ct-promo__button').textContent.trim()).toContain('Learn More');
    expect(c.querySelector('.ct-promo__button').getAttribute('href')).toBe('https://example.com');
    expect(c.querySelector('.ct-promo__button').getAttribute('target')).toBe('_blank');
    expect(c.querySelector('.ct-promo__content-bottom').textContent.trim()).toBe('Bottom Content');
    expect(c.querySelector('.ct-promo').getAttribute('data-test')).toBe('true');

    assertUniqueCssClasses(c);
  });

  test('renders without content_bottom and link', async () => {
    const c = await dom(template, {
      content_top: 'Top Content',
      title: 'Promo Title',
      content: 'Promo content text.',
      is_contained: true,
      content_bottom: '',
      link: null,
      theme: 'light',
      vertical_spacing: '',
      with_background: false,
      modifier_class: '',
    });

    expect(c.querySelectorAll('.ct-promo')).toHaveLength(1);
    expect(c.querySelector('.ct-promo').classList).toContain('ct-theme-light');
    expect(c.querySelector('.ct-promo').classList).not.toContain('ct-promo--with-background');
    expect(c.querySelector('.ct-promo').classList).not.toContain('ct-vertical-spacing--both');
    expect(c.querySelector('.ct-promo__content-top').textContent.trim()).toBe('Top Content');
    expect(c.querySelector('.ct-promo__title').textContent.trim()).toBe('Promo Title');
    expect(c.querySelector('.ct-promo__content').textContent.trim()).toBe('Promo content text.');
    expect(c.querySelector('.ct-promo__content-bottom')).toBeNull();
    expect(c.querySelector('.ct-promo__button')).toBeNull();

    assertUniqueCssClasses(c);
  });

  test('renders without content_top and content_bottom', async () => {
    const c = await dom(template, {
      title: 'Promo Title',
      content: 'Promo content text.',
      is_contained: false,
      link: {
        text: 'Learn More',
        url: 'https://example.com',
        is_new_window: false,
        is_external: false,
      },
      content_top: '',
      content_bottom: '',
      theme: 'light',
      vertical_spacing: '',
      with_background: false,
      modifier_class: '',
    });

    expect(c.querySelectorAll('.ct-promo')).toHaveLength(1);
    expect(c.querySelector('.ct-promo').classList).toContain('ct-theme-light');
    expect(c.querySelector('.ct-promo').classList).not.toContain('ct-promo--with-background');
    expect(c.querySelector('.ct-promo').classList).not.toContain('ct-vertical-spacing--both');
    expect(c.querySelector('.ct-promo__title').textContent.trim()).toBe('Promo Title');
    expect(c.querySelector('.ct-promo__content').textContent.trim()).toBe('Promo content text.');
    expect(c.querySelector('.ct-promo__button').textContent.trim()).toContain('Learn More');
    expect(c.querySelector('.ct-promo__button').getAttribute('href')).toBe('https://example.com');
    expect(c.querySelector('.ct-promo__button').getAttribute('target')).toBeNull();
    expect(c.querySelector('.ct-promo__content-top')).toBeNull();
    expect(c.querySelector('.ct-promo__content-bottom')).toBeNull();

    assertUniqueCssClasses(c);
  });

  test('does not render when title and content are empty', async () => {
    const c = await dom(template, {
      title: '',
      content: '',
    });

    expect(c.querySelectorAll('.ct-promo')).toHaveLength(0);
  });
});
