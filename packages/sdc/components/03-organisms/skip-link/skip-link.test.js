const template = 'components/03-organisms/skip-link/skip-link.twig';

describe('Skip Link Component', () => {
  test('renders with only required attributes', async () => {
    const c = await dom(template, {
      url: '#main-content',
    });

    expect(c.querySelectorAll('.ct-skip-link')).toHaveLength(1);
    expect(c.querySelector('.ct-skip-link__link').textContent.trim()).toBe('Skip to main content');
    expect(c.querySelector('.ct-skip-link__link').getAttribute('href')).toBe('#main-content');

    assertUniqueCssClasses(c);
  });

  test('renders with all attributes provided', async () => {
    const c = await dom(template, {
      theme: 'dark',
      text: 'Go to main content',
      url: '#main-content',
      modifier_class: 'additional-class',
    });

    expect(c.querySelectorAll('.ct-skip-link')).toHaveLength(1);
    expect(c.querySelector('.ct-skip-link').classList).toContain('ct-theme-dark');
    expect(c.querySelector('.ct-skip-link').classList).toContain('additional-class');
    expect(c.querySelector('.ct-skip-link__link').textContent.trim()).toBe('Go to main content');
    expect(c.querySelector('.ct-skip-link__link').getAttribute('href')).toBe('#main-content');

    assertUniqueCssClasses(c);
  });

  test('renders with default text when text is empty', async () => {
    const c = await dom(template, {
      theme: 'light',
      text: '',
      url: '#main-content',
      modifier_class: '',
    });

    expect(c.querySelectorAll('.ct-skip-link')).toHaveLength(1);
    expect(c.querySelector('.ct-skip-link').classList).toContain('ct-theme-light');
    expect(c.querySelector('.ct-skip-link__link').textContent.trim()).toBe('Skip to main content');
    expect(c.querySelector('.ct-skip-link__link').getAttribute('href')).toBe('#main-content');

    assertUniqueCssClasses(c);
  });
});
