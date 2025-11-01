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
