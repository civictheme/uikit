import DrupalAttribute from 'drupal-attribute';

const template = 'components/02-molecules/publication-card/publication-card.twig';

describe('Publication Card Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      file: {
        name: 'Sample File',
        ext: 'PDF',
        url: 'https://example.com/sample.pdf',
        size: '2MB',
      },
      title: 'Publication Card Title',
    });

    expect(c.querySelectorAll('.ct-publication-card')).toHaveLength(1);
    expect(c.querySelector('.ct-publication-card__title').textContent.trim()).toEqual('Publication Card Title');
    expect(c.querySelector('.ct-publication-card__filename').textContent.trim()).toContain('Sample File (PDF, 2MB)');

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      content_top: 'Top content',
      image_over: 'Image over content',
      content_middle: 'Middle content',
      content_bottom: 'Bottom content',
      image: { url: 'https://example.com/image.jpg', alt: 'Image description' },
      title: 'Publication Card Title',
      summary: 'This is the summary of the publication card.',
      file: {
        name: 'Sample File',
        ext: 'PDF',
        url: 'https://example.com/sample.pdf',
        size: '2MB',
        created: '2023-01-01',
        changed: '2023-02-01',
        icon: 'pdf-file',
      },
      theme: 'dark',
      attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
      modifier_class: 'custom-class',
    });

    const element = c.querySelector('.ct-publication-card');
    expect(element).not.toBeNull();
    expect(element.classList.contains('ct-theme-dark')).toBe(true);
    expect(element.classList.contains('ct-publication-card--with-image')).toBe(true);
    expect(element.classList.contains('custom-class')).toBe(true);
    expect(element.getAttribute('data-test')).toEqual('true');

    expect(c.querySelector('.ct-publication-card__content-top').textContent.trim()).toEqual('Top content');
    expect(c.querySelector('.ct-publication-card__content-bottom').textContent.trim()).toEqual('Bottom content');
    expect(c.querySelector('.ct-publication-card__title').textContent.trim()).toEqual('Publication Card Title');
    expect(c.querySelector('.ct-publication-card__summary').textContent.trim()).toEqual('This is the summary of the publication card.');

    const image = c.querySelector('.ct-publication-card__image img');
    expect(image).toBeTruthy();
    expect(image.getAttribute('src')).toEqual('https://example.com/image.jpg');
    expect(image.getAttribute('alt')).toEqual('Image description');

    const fileLink = c.querySelector('.ct-publication-card__filename');
    expect(fileLink).toBeTruthy();
    expect(fileLink.textContent.trim()).toContain('Sample File (PDF, 2MB)');

    assertUniqueCssClasses(c);
  });

  test('does not render when file is empty', async () => {
    const c = await dom(template, {
      file: {},
    });

    expect(c.querySelectorAll('.ct-publication-card')).toHaveLength(0);
  });

  test('renders file link with extension and size', async () => {
    const c = await dom(template, {
      file: {
        name: 'Sample File',
        ext: 'PDF',
        url: 'https://example.com/sample.pdf',
        size: '2MB',
      },
    });

    const fileLink = c.querySelector('.ct-publication-card__link');
    expect(fileLink).toBeTruthy();
    expect(fileLink.textContent.trim()).toContain('Sample File (PDF, 2MB)');

    assertUniqueCssClasses(c);
  });

  test('renders with summary when provided', async () => {
    const c = await dom(template, {
      file: {
        name: 'Sample File',
        ext: 'PDF',
        url: 'https://example.com/sample.pdf',
        size: '2MB',
      },
      summary: 'This is the summary of the publication card.',
    });

    const summary = c.querySelector('.ct-publication-card__summary');
    expect(summary).toBeTruthy();
    expect(summary.textContent.trim()).toEqual('This is the summary of the publication card.');

    assertUniqueCssClasses(c);
  });
});
