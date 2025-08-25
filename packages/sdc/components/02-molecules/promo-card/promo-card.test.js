const template = 'components/02-molecules/promo-card/promo-card.twig';

describe('Promo Card Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      title: 'Promo Card Title',
      summary: 'This is the summary of the promo card.',
    });

    expect(c.querySelectorAll('.ct-promo-card')).toHaveLength(1);
    expect(c.querySelector('.ct-promo-card__title').textContent.trim()).toEqual('Promo Card Title');
    expect(c.querySelector('.ct-promo-card__summary').textContent.trim()).toEqual('This is the summary of the promo card.');

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      content_top: 'Top content',
      image_over: 'Image over content',
      content_middle: 'Middle content',
      content_bottom: 'Bottom content',
      image: { url: 'https://example.com/image.jpg', alt: 'Image description' },
      subtitle: 'Subtitle text',
      date: '2023-12-01',
      date_iso: '2023-12-01T00:00:00Z',
      title: 'Promo Card Title',
      summary: 'This is the summary of the promo card.',
      link: { text: 'Learn more', url: 'https://example.com', is_new_window: true, is_external: true },
      tags: ['Tag1', 'Tag2'],
      theme: 'dark',
      attributes: 'data-test="true"',
      modifier_class: 'custom-class',
    });

    const element = c.querySelector('.ct-promo-card');
    expect(element).not.toBeNull();
    expect(element.classList.contains('ct-theme-dark')).toBe(true);
    expect(element.classList.contains('ct-promo-card--with-image')).toBe(true);
    expect(element.classList.contains('ct-promo-card--card-clickable')).toBe(true);
    expect(element.classList.contains('custom-class')).toBe(true);
    expect(element.getAttribute('data-test')).toEqual('true');

    expect(c.querySelector('.ct-promo-card__content-top').textContent.trim()).toEqual('Top content');
    expect(c.querySelector('.ct-promo-card__content-bottom').textContent.trim()).toEqual('Bottom content');
    expect(c.querySelector('.ct-promo-card__title').textContent.trim()).toContain('Promo Card Title');
    expect(c.querySelector('.ct-promo-card__summary').textContent.trim()).toEqual('This is the summary of the promo card.');

    const image = c.querySelector('.ct-promo-card__image img');
    expect(image).toBeTruthy();
    expect(image.getAttribute('src')).toEqual('https://example.com/image.jpg');
    expect(image.getAttribute('alt')).toEqual('Image description');

    const subtitle = c.querySelector('.ct-promo-card__subtitle');
    expect(subtitle).toBeTruthy();
    expect(subtitle.textContent.trim()).toEqual('Subtitle text');

    const date = c.querySelector('.ct-promo-card__date');
    expect(date).toBeTruthy();

    const link = c.querySelector('.ct-promo-card__title-link');
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toEqual('https://example.com');
    expect(link.getAttribute('target')).toEqual('_blank');

    const tags = c.querySelectorAll('.ct-promo-card__tags .ct-tag');
    expect(tags).toHaveLength(2);
    expect(tags[0].textContent.trim()).toEqual('Tag1');
    expect(tags[1].textContent.trim()).toEqual('Tag2');

    assertUniqueCssClasses(c);
  });

  test('does not render when title is empty', async () => {
    const c = await dom(template, {
      title: '',
      summary: 'This is the summary of the promo card.',
    });

    expect(c.querySelectorAll('.ct-promo-card')).toHaveLength(0);
  });

  test('renders with link when provided', async () => {
    const c = await dom(template, {
      title: 'Promo Card Title',
      summary: 'This is the summary of the promo card.',
      link: { text: 'Learn more', url: 'https://example.com' },
    });

    const link = c.querySelector('.ct-promo-card__title-link');
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toEqual('https://example.com');

    assertUniqueCssClasses(c);
  });
});
