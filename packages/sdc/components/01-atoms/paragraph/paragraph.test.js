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
});
