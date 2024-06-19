const template = 'components/01-atoms/paragraph/paragraph.twig';

describe('Paragraph Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      content: 'Sample content',
    });

    expect(c.querySelectorAll('.ct-paragraph')).toHaveLength(1);
    expect(c.querySelector('.ct-paragraph').textContent.trim()).toEqual('Sample content');

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      content: 'Sample content',
      size: 'large',
      allow_html: true,
      attributes: 'data-test="true"',
      modifier_class: 'custom-class',
      theme: 'dark',
    });

    expect(c.querySelectorAll('.ct-paragraph.custom-class.ct-theme-dark.ct-paragraph--large')).toHaveLength(1);
    expect(c.querySelector('.ct-paragraph').textContent.trim()).toEqual('Sample content');
    expect(c.querySelector('.ct-paragraph').getAttribute('data-test')).toEqual('true');

    assertUniqueCssClasses(c);
  });

  test('does not render when content is empty', async () => {
    const c = await dom(template, {
      content: '',
    });

    expect(c.querySelectorAll('.ct-paragraph')).toHaveLength(0);
  });

  test('strips HTML tags from content when allow_html is false', async () => {
    const c = await dom(template, {
      content: '<strong>Sample content</strong>',
      allow_html: false,
    });

    expect(c.querySelector('.ct-paragraph').textContent.trim()).toEqual('Sample content');
    expect(c.querySelector('.ct-paragraph').innerHTML).not.toContain('<strong>');

    assertUniqueCssClasses(c);
  });

  test('renders HTML tags in content when allow_html is true', async () => {
    const c = await dom(template, {
      content: '<strong>Sample content</strong>',
      allow_html: true,
    });

    expect(c.querySelector('.ct-paragraph').innerHTML.trim()).toEqual('<strong>Sample content</strong>');

    assertUniqueCssClasses(c);
  });
});
