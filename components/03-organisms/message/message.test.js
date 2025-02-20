const template = 'components/03-organisms/message/message.twig';

describe('Message Component', () => {
  test('renders with all attributes provided', async () => {
    const c = await dom(template, {
      theme: 'dark',
      type: 'error',
      title: 'this is title message.',
      content: 'This is an error message.',
      modifier_class: 'additional-class',
      with_background: true,
      vertical_spacing: 'both',
      hide_role: false,
    });

    expect(c.querySelectorAll('.ct-message')).toHaveLength(1);
    expect(c.querySelector('.ct-message').classList).toContain('ct-theme-dark');
    expect(c.querySelector('.ct-message').classList).toContain('ct-message--error');
    expect(c.querySelector('.ct-message').classList).toContain('ct-message--with-background');
    expect(c.querySelector('.ct-message').classList).toContain('ct-vertical-spacing-inset--both');
    expect(c.querySelector('.ct-message').classList).toContain('additional-class');
    expect(c.querySelector('.ct-message__title').textContent.trim()).toBe('this is title message.');
    expect(c.querySelector('.ct-message__summary').textContent.trim()).toBe('This is an error message.');
    expect(c.querySelector('.ct-message').getAttribute('role')).toBe('alert');
    expect(c.querySelector('.ct-message').getAttribute('aria-label')).toBe('error');
    expect(c.querySelector('.ct-message').getAttribute('aria-live')).toBe('assertive');

    assertUniqueCssClasses(c);
  });

  test('renders with default type and theme', async () => {
    const c = await dom(template, {
      content: 'This is a default message.',
      modifier_class: '',
    });

    expect(c.querySelectorAll('.ct-message')).toHaveLength(1);
    expect(c.querySelector('.ct-message').classList).toContain('ct-theme-light');
    expect(c.querySelector('.ct-message').classList).toContain('ct-message--information');
    expect(c.querySelector('.ct-message__summary').textContent.trim()).toBe('This is a default message.');
    expect(c.querySelector('.ct-message').getAttribute('role')).toBe('contentinfo');
    expect(c.querySelector('.ct-message').getAttribute('aria-label')).toBe('information');
    expect(c.querySelector('.ct-message').getAttribute('aria-live')).toBe('assertive');

    assertUniqueCssClasses(c);
  });

  test('renders without content', async () => {
    const c = await dom(template, {
      theme: 'light',
      type: 'success',
      content: '',
      modifier_class: 'additional-class',
    });

    expect(c.querySelectorAll('.ct-message')).toHaveLength(1);
    expect(c.querySelector('.ct-message').classList).toContain('ct-theme-light');
    expect(c.querySelector('.ct-message').classList).toContain('ct-message--success');
    expect(c.querySelector('.ct-message').classList).toContain('additional-class');
    expect(c.querySelector('.ct-message__summary')).toBeNull();
    expect(c.querySelector('.ct-message').getAttribute('role')).toBe('contentinfo');
    expect(c.querySelector('.ct-message').getAttribute('aria-label')).toBe('success');
    expect(c.querySelector('.ct-message').getAttribute('aria-live')).toBe('assertive');

    assertUniqueCssClasses(c);
  });

  test('renders without role', async () => {
    const c = await dom(template, {
      theme: 'light',
      type: 'success',
      content: 'This is a default message.',
      modifier_class: 'additional-class',
      hide_role: true,
    });

    expect(c.querySelectorAll('.ct-message')).toHaveLength(1);
    expect(c.querySelector('.ct-message').classList).toContain('ct-theme-light');
    expect(c.querySelector('.ct-message').classList).toContain('ct-message--success');
    expect(c.querySelector('.ct-message').classList).toContain('additional-class');
    expect(c.querySelector('.ct-message__summary').textContent.trim()).toBe('This is a default message.');
    expect(c.querySelector('.ct-message').getAttribute('role')).toBeNull();
    expect(c.querySelector('.ct-message').getAttribute('aria-label')).toBeNull();
    expect(c.querySelector('.ct-message').getAttribute('aria-live')).toBeNull();

    assertUniqueCssClasses(c);
  });

  test('renders with background', async () => {
    const c = await dom(template, {
      theme: 'light',
      type: 'success',
      content: 'This is a default message.',
      with_background: true,
      hide_role: true,
    });

    expect(c.querySelectorAll('.ct-message')).toHaveLength(1);
    expect(c.querySelector('.ct-message').classList).toContain('ct-message--with-background');
    expect(c.querySelector('.ct-message__summary').textContent.trim()).toBe('This is a default message.');
    expect(c.querySelector('.ct-message').getAttribute('role')).toBeNull();
    expect(c.querySelector('.ct-message').getAttribute('aria-label')).toBeNull();
    expect(c.querySelector('.ct-message').getAttribute('aria-live')).toBeNull();

    assertUniqueCssClasses(c);
  });

  test('renders with vertical spacing', async () => {
    const c = await dom(template, {
      theme: 'light',
      type: 'success',
      content: 'This is a default message.',
      vertical_spacing: 'both',
      hide_role: true,
    });

    expect(c.querySelectorAll('.ct-message')).toHaveLength(1);
    expect(c.querySelector('.ct-message').classList).toContain('ct-vertical-spacing-inset--both');
    expect(c.querySelector('.ct-message__summary').textContent.trim()).toBe('This is a default message.');
    expect(c.querySelector('.ct-message').getAttribute('role')).toBeNull();
    expect(c.querySelector('.ct-message').getAttribute('aria-label')).toBeNull();
    expect(c.querySelector('.ct-message').getAttribute('aria-live')).toBeNull();

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

    expect(c.querySelectorAll('.ct-message')).toHaveLength(1);
    expect(c.querySelector('.ct-message').classList).toContain('ct-theme-light');
    expect(c.querySelector('.ct-message').classList).toContain('ct-message--warning');
    expect(c.querySelector('.ct-message__title')).toBeNull();
    expect(c.querySelector('.ct-message__summary')).toBeNull();

    assertUniqueCssClasses(c);
  });
});
