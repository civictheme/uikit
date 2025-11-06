import DrupalAttribute from 'drupal-attribute';

const template = 'components/01-atoms/button/button.twig';

describe('Button Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      text: 'Click me',
    });

    expect(c.querySelectorAll('.ct-button')).toHaveLength(1);
    expect(c.querySelector('.ct-button').textContent.trim()).toEqual('Click me');
    expect(c.querySelector('.ct-button').getAttribute('data-component-name')).toEqual('button');

    assertUniqueCssClasses(c);
  });

  test('renders as a link with optional attributes', async () => {
    const c = await dom(template, {
      kind: 'link',
      text: 'Click me',
      url: 'https://example.com',
      is_new_window: true,
      is_external: false,
      attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
      modifier_class: 'custom-class',
      theme: 'dark',
      icon: 'call',
      icon_placement: 'before',
    });

    expect(c.querySelectorAll('.ct-button.custom-class.ct-theme-dark.ct-button--link')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-button.custom-class.ct-theme-dark.ct-button--link.ct-button--external')).toHaveLength(0);
    expect(c.querySelector('.ct-button').getAttribute('href')).toEqual('https://example.com');
    expect(c.querySelector('.ct-button').getAttribute('target')).toEqual('_blank');
    expect(c.querySelector('.ct-button').getAttribute('data-test')).toEqual('true');
    expect(c.querySelector('.ct-button__icon')).toBeTruthy();
    expect(c.querySelector('.ct-button').textContent.trim()).toContain('Click me');

    assertUniqueCssClasses(c);
  });

  test('renders as a link with optional attributes, is external', async () => {
    const c = await dom(template, {
      kind: 'link',
      text: 'Click me',
      url: 'https://example.com',
      is_new_window: true,
      is_external: true,
      attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
      modifier_class: 'custom-class',
      theme: 'dark',
      icon: 'call',
      icon_placement: 'before',
    });

    expect(c.querySelectorAll('.ct-button.custom-class.ct-theme-dark.ct-button--link.ct-button--external')).toHaveLength(1);
    expect(c.querySelector('.ct-button').getAttribute('href')).toEqual('https://example.com');
    expect(c.querySelector('.ct-button').getAttribute('target')).toEqual('_blank');
    expect(c.querySelector('.ct-button').getAttribute('data-test')).toEqual('true');
    expect(c.querySelector('.ct-button').textContent.trim()).toContain('Click me');

    assertUniqueCssClasses(c);
  });

  test('renders as a submit button', async () => {
    const c = await dom(template, {
      kind: 'submit',
      text: 'Submit',
    });

    expect(c.querySelectorAll('input[type="submit"].ct-button')).toHaveLength(1);
    expect(c.querySelector('input[type="submit"].ct-button').getAttribute('value')).toEqual('Submit');
    expect(c.querySelector('input[type="submit"].ct-button').getAttribute('data-component-name')).toEqual('button');

    assertUniqueCssClasses(c);
  });

  test('renders as a reset button', async () => {
    const c = await dom(template, {
      kind: 'reset',
      text: 'Reset',
    });

    expect(c.querySelectorAll('input[type="reset"].ct-button')).toHaveLength(1);
    expect(c.querySelector('input[type="reset"].ct-button').getAttribute('value')).toEqual('Reset');
    expect(c.querySelector('input[type="reset"].ct-button').getAttribute('data-component-name')).toEqual('button');

    assertUniqueCssClasses(c);
  });

  test('renders with disabled state', async () => {
    const c = await dom(template, {
      text: 'Click me',
      is_disabled: true,
    });

    expect(c.querySelectorAll('.ct-button[disabled][aria-disabled="true"]')).toHaveLength(1);
    expect(c.querySelector('.ct-button').textContent.trim()).toEqual('Click me');

    assertUniqueCssClasses(c);
  });
});

describe('Button Attribute Handling', () => {
  test('renders with null attributes', async () => {
    const c = await dom(template, {
      text: 'Click me',
      attributes: null,
    });

    expect(c.querySelectorAll('.ct-button')).toHaveLength(1);
    expect(c.querySelector('.ct-button').textContent.trim()).toEqual('Click me');

    assertUniqueCssClasses(c);
  });

  test('renders with undefined attributes', async () => {
    const c = await dom(template, {
      text: 'Click me',
      attributes: undefined,
    });

    expect(c.querySelectorAll('.ct-button')).toHaveLength(1);
    expect(c.querySelector('.ct-button').textContent.trim()).toEqual('Click me');

    assertUniqueCssClasses(c);
  });

  test('renders with multiple DrupalAttribute properties', async () => {
    const c = await dom(template, {
      text: 'Click me',
      attributes: new DrupalAttribute()
        .setAttribute('data-test', 'true')
        .setAttribute('data-custom', 'value')
        .setAttribute('id', 'my-button'),
    });

    expect(c.querySelector('.ct-button').getAttribute('data-test')).toEqual('true');
    expect(c.querySelector('.ct-button').getAttribute('data-custom')).toEqual('value');
    expect(c.querySelector('.ct-button').getAttribute('id')).toEqual('my-button');

    assertUniqueCssClasses(c);
  });

  test('renders link button with attributes', async () => {
    const c = await dom(template, {
      kind: 'link',
      text: 'Click me',
      url: 'https://example.com',
      attributes: new DrupalAttribute().setAttribute('data-link-id', 'link-123'),
    });

    expect(c.querySelectorAll('.ct-button--link')).toHaveLength(1);
    expect(c.querySelector('.ct-button').getAttribute('data-link-id')).toEqual('link-123');

    assertUniqueCssClasses(c);
  });

  test('renders submit button with attributes', async () => {
    const c = await dom(template, {
      kind: 'submit',
      text: 'Submit',
      attributes: new DrupalAttribute().setAttribute('data-submit', 'form-1'),
    });

    expect(c.querySelectorAll('input[type="submit"]')).toHaveLength(1);
    expect(c.querySelector('input[type="submit"]').getAttribute('data-submit')).toEqual('form-1');

    assertUniqueCssClasses(c);
  });

  test('renders reset button with attributes', async () => {
    const c = await dom(template, {
      kind: 'reset',
      text: 'Reset',
      attributes: new DrupalAttribute().setAttribute('data-reset', 'form-1'),
    });

    expect(c.querySelectorAll('input[type="reset"]')).toHaveLength(1);
    expect(c.querySelector('input[type="reset"]').getAttribute('data-reset')).toEqual('form-1');

    assertUniqueCssClasses(c);
  });

  test('renders with icon before text', async () => {
    const c = await dom(template, {
      text: 'Call Us',
      icon: 'call',
      icon_placement: 'before',
    });

    expect(c.querySelectorAll('.ct-button')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-button__icon')).toHaveLength(1);
    expect(c.querySelector('.ct-button').textContent.trim()).toContain('Call Us');

    assertUniqueCssClasses(c);
  });

  test('renders with icon after text', async () => {
    const c = await dom(template, {
      text: 'Learn More',
      icon: 'arrow-right',
      icon_placement: 'after',
    });

    expect(c.querySelectorAll('.ct-button')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-button__icon')).toHaveLength(1);
    expect(c.querySelector('.ct-button').textContent.trim()).toContain('Learn More');

    assertUniqueCssClasses(c);
  });

  test('renders with icon_single_only flag', async () => {
    const c = await dom(template, {
      text: 'External',
      icon: 'custom-icon',
      is_external: true,
      icon_single_only: true,
    });

    expect(c.querySelectorAll('.ct-button')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-button__icon')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('renders with all button types', async () => {
    const types = ['primary', 'secondary', 'tertiary'];
    
    for (const type of types) {
      const c = await dom(template, {
        text: 'Button',
        type,
      });

      expect(c.querySelectorAll(`.ct-button--${type}`)).toHaveLength(1);
    }
  });

  test('renders with all button sizes', async () => {
    const sizes = ['small', 'regular', 'large'];
    
    for (const size of sizes) {
      const c = await dom(template, {
        text: 'Button',
        size,
      });

      expect(c.querySelectorAll(`.ct-button--${size}`)).toHaveLength(1);
    }
  });

  test('renders dismissable button', async () => {
    const c = await dom(template, {
      text: 'Dismiss',
      is_dismissable: true,
    });

    expect(c.querySelectorAll('.ct-button--dismiss')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('renders external link with external class', async () => {
    const c = await dom(template, {
      kind: 'link',
      text: 'External',
      url: 'https://example.com',
      is_external: true,
    });

    expect(c.querySelectorAll('.ct-button--external')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('renders with combined theme, type, size, and modifier', async () => {
    const c = await dom(template, {
      text: 'Button',
      theme: 'dark',
      type: 'primary',
      size: 'large',
      modifier_class: 'custom-button',
      attributes: new DrupalAttribute().setAttribute('data-combined', 'true'),
    });

    expect(c.querySelectorAll('.ct-button.ct-theme-dark.ct-button--primary.ct-button--large.custom-button')).toHaveLength(1);
    expect(c.querySelector('.ct-button').getAttribute('data-combined')).toEqual('true');

    assertUniqueCssClasses(c);
  });

  test('renders disabled link button', async () => {
    const c = await dom(template, {
      kind: 'link',
      text: 'Disabled Link',
      url: '#',
      is_disabled: true,
    });

    expect(c.querySelector('a[disabled][aria-disabled="true"]')).toBeTruthy();

    assertUniqueCssClasses(c);
  });

  test('renders with aria-disabled on all button kinds', async () => {
    const kinds = ['button', 'link', 'submit', 'reset'];
    
    for (const kind of kinds) {
      const c = await dom(template, {
        kind,
        text: 'Button',
        url: kind === 'link' ? '#' : undefined,
        is_disabled: true,
      });

      expect(c.querySelector('[aria-disabled="true"]')).toBeTruthy();
    }
  });

  test('renders with special characters in text', async () => {
    const c = await dom(template, {
      text: 'Click & "Submit" <Now>',
    });

    expect(c.querySelector('.ct-button').textContent.trim()).toEqual('Click & "Submit" <Now>');

    assertUniqueCssClasses(c);
  });

  test('renders with icon_group_disabled flag', async () => {
    const c = await dom(template, {
      text: 'Button',
      icon: 'custom',
      is_external: true,
      icon_group_disabled: true,
    });

    expect(c.querySelectorAll('.ct-button')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('renders link without URL', async () => {
    const c = await dom(template, {
      kind: 'link',
      text: 'No URL',
    });

    expect(c.querySelectorAll('a.ct-button')).toHaveLength(1);
    expect(c.querySelector('a.ct-button').hasAttribute('href')).toBe(false);

    assertUniqueCssClasses(c);
  });

  test('renders with data-component-name attribute', async () => {
    const c = await dom(template, {
      text: 'Button',
    });

    expect(c.querySelector('.ct-button').getAttribute('data-component-name')).toEqual('button');

    assertUniqueCssClasses(c);
  });

  test('preserves attributes across different button kinds', async () => {
    const testAttr = new DrupalAttribute().setAttribute('data-preserve', 'value');

    const kinds = [
      { kind: 'button', text: 'Button' },
      { kind: 'link', text: 'Link', url: '#' },
      { kind: 'submit', text: 'Submit' },
      { kind: 'reset', text: 'Reset' },
    ];

    for (const config of kinds) {
      const c = await dom(template, {
        ...config,
        attributes: testAttr,
      });

      expect(c.querySelector('[data-preserve="value"]')).toBeTruthy();
    }
  });
});

describe('Button Edge Cases', () => {
  test('renders with empty text', async () => {
    const c = await dom(template, {
      text: '',
    });

    expect(c.querySelectorAll('.ct-button')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('renders with empty modifier_class', async () => {
    const c = await dom(template, {
      text: 'Button',
      modifier_class: '',
    });

    expect(c.querySelectorAll('.ct-button')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('renders link with new window without is_external', async () => {
    const c = await dom(template, {
      kind: 'link',
      text: 'New Window',
      url: '#',
      is_new_window: true,
      is_external: false,
    });

    expect(c.querySelector('a[target="_blank"]')).toBeTruthy();
    expect(c.querySelectorAll('.ct-button--external')).toHaveLength(0);

    assertUniqueCssClasses(c);
  });

  test('renders with default theme when not specified', async () => {
    const c = await dom(template, {
      text: 'Button',
    });

    expect(c.querySelectorAll('.ct-button')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('renders with default type when not specified', async () => {
    const c = await dom(template, {
      text: 'Button',
    });

    expect(c.querySelectorAll('.ct-button')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('renders with default size when not specified', async () => {
    const c = await dom(template, {
      text: 'Button',
    });

    expect(c.querySelectorAll('.ct-button')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });
});