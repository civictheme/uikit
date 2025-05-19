const template = 'components/01-atoms/heading/heading.twig';

describe('Heading Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      content: 'Sample Heading',
    });

    expect(c.querySelectorAll('.ct-heading')).toHaveLength(1);
    expect(c.querySelector('.ct-heading').textContent.trim()).toEqual('Sample Heading');
    expect(c.querySelector('.ct-heading').tagName.toLowerCase()).toEqual('h2'); // Default level is 2

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      content: 'Sample Heading',
      level: '3',
      attributes: 'data-test="true"',
      modifier_class: 'custom-class',
      theme: 'dark',
    });

    expect(c.querySelectorAll('.ct-heading.custom-class.ct-theme-dark')).toHaveLength(1);
    expect(c.querySelector('.ct-heading').textContent.trim()).toEqual('Sample Heading');
    expect(c.querySelector('.ct-heading').tagName.toLowerCase()).toEqual('h3');
    expect(c.querySelector('.ct-heading').getAttribute('data-test')).toEqual('true');

    assertUniqueCssClasses(c);
  });

  test('does not render when content is empty', async () => {
    const c = await dom(template, {
      content: '',
    });

    expect(c.querySelectorAll('.ct-heading')).toHaveLength(0);
  });
});
