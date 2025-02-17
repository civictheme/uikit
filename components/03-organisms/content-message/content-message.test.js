const template = 'components/03-organisms/content-message/content-message.twig';

describe('Content Message Component', () => {
  test('renders with all attributes provided', async () => {
    const c = await dom(template, {
      theme: 'dark',
      type: 'error',
      title: 'this is title message.',
      content: 'This is an error message.',
      vertical_spacing: 'top',
      with_background: true,
      modifier_class: 'additional-class',
    });

    expect(c.querySelectorAll('.ct-content-message')).toHaveLength(1);
    expect(c.querySelector('.ct-content-message').classList).toContain('ct-theme-dark');
    expect(c.querySelector('.ct-content-message').classList).toContain('ct-vertical-spacing-inset--top');
    expect(c.querySelector('.ct-content-message').classList).toContain('ct-content-message--with-background');
    expect(c.querySelector('.ct-content-message').classList).toContain('additional-class');
    expect(c.querySelector('.ct-message').classList).toContain('ct-message--error');
    expect(c.querySelector('.ct-message__title').textContent.trim()).toBe('this is title message.');
    expect(c.querySelector('.ct-message__summary').textContent.trim()).toBe('This is an error message.');

    assertUniqueCssClasses(c);
  });

  test('renders with default type and theme', async () => {
    const c = await dom(template, {
      theme: 'light',
      type: 'information',
      content: 'This is a default message.',
      modifier_class: '',
    });

    expect(c.querySelectorAll('.ct-content-message')).toHaveLength(1);
    expect(c.querySelector('.ct-content-message').classList).toContain('ct-theme-light');
    expect(c.querySelector('.ct-message').classList).toContain('ct-message--information');
    expect(c.querySelector('.ct-message__summary').textContent.trim()).toBe('This is a default message.');

    assertUniqueCssClasses(c);
  });

  test('renders without content', async () => {
    const c = await dom(template, {
      theme: 'light',
      type: 'success',
      content: '',
      modifier_class: 'additional-class',
    });

    expect(c.querySelectorAll('.ct-content-message')).toHaveLength(1);
    expect(c.querySelector('.ct-content-message').classList).toContain('ct-theme-light');
    expect(c.querySelector('.ct-content-message').classList).toContain('additional-class');
    expect(c.querySelector('.ct-message').classList).toContain('ct-message--success');
    expect(c.querySelector('.ct-message__summary')).toBeNull();

    assertUniqueCssClasses(c);
  });

  test('does not render when content and title are empty', async () => {
    const c = await dom(template, {
      theme: 'light',
      type: 'warning',
      content: '',
      title: '',
      modifier_class: '',
    });

    expect(c.querySelectorAll('.ct-content-message')).toHaveLength(1);
    expect(c.querySelector('.ct-content-message').classList).toContain('ct-theme-light');
    expect(c.querySelector('.ct-message').classList).toContain('ct-message--warning');
    expect(c.querySelector('.ct-message__title')).toBeNull();
    expect(c.querySelector('.ct-message__summary')).toBeNull();

    assertUniqueCssClasses(c);
  });
});
