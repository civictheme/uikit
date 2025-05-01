const template = 'components/02-molecules/subject-card/subject-card.twig';

describe('Subject Card Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      title: 'Subject Card Title',
    });

    expect(c.querySelectorAll('.ct-subject-card')).toHaveLength(1);
    expect(c.querySelector('.ct-subject-card__title').textContent.trim()).toEqual('Subject Card Title');

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      title: 'Subject Card Title',
      image_over: 'Image overlay content',
      image: {
        url: 'https://example.com/image.jpg',
        alt: 'Image Alt Text',
      },
      link: {
        text: 'Read more',
        url: 'https://example.com/read-more',
        is_new_window: true,
        is_external: true,
      },
      theme: 'dark',
      attributes: 'data-test="true"',
      modifier_class: 'custom-class',
    });

    const element = c.querySelector('.ct-subject-card');
    expect(element).not.toBeNull();
    expect(element.classList.contains('ct-theme-dark')).toBe(true);
    expect(element.classList.contains('ct-subject-card--with-image')).toBe(true);
    expect(element.classList.contains('custom-class')).toBe(true);
    expect(element.getAttribute('data-test')).toEqual('true');

    const image = c.querySelector('.ct-subject-card__image img');
    expect(image).not.toBeNull();
    expect(image.getAttribute('src')).toEqual('https://example.com/image.jpg');
    expect(image.getAttribute('alt')).toEqual('Image Alt Text');

    expect(c.querySelector('.ct-subject-card__image__over').textContent.trim()).toEqual('Image overlay content');

    const link = c.querySelector('.ct-subject-card__title__link');
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toEqual('https://example.com/read-more');
    expect(link.getAttribute('target')).toEqual('_blank');

    assertUniqueCssClasses(c);
  });

  test('does not render when title is empty', async () => {
    const c = await dom(template, {
      title: '',
    });

    expect(c.querySelectorAll('.ct-subject-card')).toHaveLength(0);
  });

  test('renders with link and image', async () => {
    const c = await dom(template, {
      title: 'Subject Card Title',
      link: {
        text: 'Read more',
        url: 'https://example.com/read-more',
      },
      image: {
        url: 'https://example.com/image.jpg',
        alt: 'Image Alt Text',
      },
    });

    const link = c.querySelector('.ct-subject-card__title__link');
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toEqual('https://example.com/read-more');

    const image = c.querySelector('.ct-subject-card__image img');
    expect(image).not.toBeNull();
    expect(image.getAttribute('src')).toEqual('https://example.com/image.jpg');
    expect(image.getAttribute('alt')).toEqual('Image Alt Text');

    assertUniqueCssClasses(c);
  });

  test('renders with content slots', async () => {
    const c = await dom(template, {
      title: 'Subject Card Title',
      image_over: 'Image overlay content',
    });

    expect(c.querySelector('.ct-subject-card__image__over').textContent.trim()).toEqual('Image overlay content');
    expect(c.querySelector('.ct-subject-card__title').textContent.trim()).toEqual('Subject Card Title');

    assertUniqueCssClasses(c);
  });
});
