import DrupalAttribute from 'drupal-attribute';

const template = 'components/02-molecules/fast-fact-card/fast-fact-card.twig';

describe('Fast Fact Card Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      title: 'Fast Fact Title',
      summary: 'This is a summary of the fast fact.',
    });

    const element = c.querySelector('.ct-fast-fact-card');
    expect(c.querySelectorAll('.ct-fast-fact-card')).toHaveLength(1);
    expect(element.classList.contains('ct-theme-light')).toBe(true);
    expect(c.querySelector('.ct-fast-fact-card__title').textContent.trim()).toEqual('Fast Fact Title');
    expect(c.querySelector('.ct-fast-fact-card__summary')).toBeTruthy();

    const image = c.querySelector('.ct-fast-fact-card__image');
    expect(image).toBeNull();

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      image: { url: 'https://example.com/image.jpg', alt: 'Image description' },
      title: 'Fast Fact Title',
      summary: 'This is a summary of the fast fact.',
      link: { text: 'Learn more', url: 'https://example.com', is_new_window: true },
      theme: 'dark',
      attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
      modifier_class: 'custom-class',
    });

    const element = c.querySelector('.ct-fast-fact-card');
    expect(element).not.toBeNull();
    expect(element.classList.contains('ct-theme-dark')).toBe(true);
    expect(element.classList.contains('ct-fast-fact-card--card-clickable')).toBe(true);
    expect(element.classList.contains('custom-class')).toBe(true);
    expect(element.getAttribute('data-test')).toEqual('true');

    expect(c.querySelector('.ct-fast-fact-card__title').textContent.trim()).toContain('Fast Fact Title');
    expect(c.querySelector('.ct-fast-fact-card__summary')).toBeTruthy();

    const image = c.querySelector('.ct-fast-fact-card__image img');
    expect(image).toBeTruthy();
    expect(image.getAttribute('src')).toEqual('https://example.com/image.jpg');
    expect(image.getAttribute('alt')).toEqual('Image description');

    const titleLink = c.querySelector('.ct-fast-fact-card__title-link');
    expect(titleLink).toBeTruthy();
    expect(titleLink.getAttribute('href')).toEqual('https://example.com');
    expect(titleLink.getAttribute('target')).toEqual('_blank');

    assertUniqueCssClasses(c);
  });

  test('renders with link when provided', async () => {
    const c = await dom(template, {
      title: 'Fast Fact Title',
      summary: 'This is a summary of the fast fact.',
      link: { text: 'Learn more', url: 'https://example.com' },
    });

    const link = c.querySelector('.ct-fast-fact-card__title-link');
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toEqual('https://example.com');

    assertUniqueCssClasses(c);
  });

  test('renders with title click only when is_title_click is true', async () => {
    const c = await dom(template, {
      title: 'Fast Fact Title',
      summary: 'This is a summary of the fast fact.',
      link: { text: 'Learn more', url: 'https://example.com' },
      is_title_click: true,
    });

    const element = c.querySelector('.ct-fast-fact-card');
    expect(element).not.toBeNull();
    expect(element.classList.contains('ct-fast-fact-card--card-clickable')).toBe(false);

    const titleLink = c.querySelector('.ct-fast-fact-card__title-link');
    expect(titleLink).toBeTruthy();
    expect(titleLink.getAttribute('href')).toEqual('https://example.com');

    assertUniqueCssClasses(c);
  });
});
