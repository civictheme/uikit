const template = 'components/03-organisms/slider/slide.twig';

describe('Slide Component', () => {
  test('renders with default heading level (h3)', async () => {
    const c = await dom(template, {
      title: 'Slide Title',
      content: 'Slide content',
    });

    expect(c.querySelectorAll('.ct-slide')).toHaveLength(1);
    expect(c.querySelector('.ct-slide__title').tagName).toBe('H3');
    expect(c.querySelector('.ct-slide__title').textContent.trim()).toBe('Slide Title');
    expect(c.querySelector('.ct-slide__title').hasAttribute('data-toc-exclude')).toBe(true);

    assertUniqueCssClasses(c);
  });

  test('renders with heading level 2 when heading_level is 2', async () => {
    const c = await dom(template, {
      title: 'Slide Title',
      content: 'Slide content',
      heading_level: 2,
    });

    expect(c.querySelector('.ct-slide__title').tagName).toBe('H2');
    expect(c.querySelector('.ct-slide__title').textContent.trim()).toBe('Slide Title');
    expect(c.querySelector('.ct-slide__title').hasAttribute('data-toc-exclude')).toBe(true);

    assertUniqueCssClasses(c);
  });

  test('renders with heading level 3 when heading_level is 3', async () => {
    const c = await dom(template, {
      title: 'Slide Title',
      content: 'Slide content',
      heading_level: 3,
    });

    expect(c.querySelector('.ct-slide__title').tagName).toBe('H3');
    expect(c.querySelector('.ct-slide__title').textContent.trim()).toBe('Slide Title');

    assertUniqueCssClasses(c);
  });

  test('does not render heading when title is empty', async () => {
    const c = await dom(template, {
      content: 'Slide content',
    });

    expect(c.querySelectorAll('.ct-slide')).toHaveLength(1);
    expect(c.querySelector('.ct-slide__title')).toBeNull();

    assertUniqueCssClasses(c);
  });
});
