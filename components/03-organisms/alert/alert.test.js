const template = 'components/03-organisms/alert/alert.twig';

describe('Alert Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      description: 'This is an info alert.',
    });

    expect(c.querySelectorAll('.ct-alert')).toHaveLength(1);
    expect(c.querySelector('.ct-alert__summary').textContent.trim()).toEqual('This is an info alert.');
    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      description: 'This is a warning alert.',
      theme: 'dark',
      type: 'warning',
      id: 'alert-1',
      title: 'Warning Alert',
      attributes: 'data-test="true"',
      modifier_class: 'custom-class',
    });

    const element = c.querySelector('.ct-alert');
    expect(element).not.toBeNull();
    expect(element.classList.contains('ct-theme-dark')).toBe(true);
    expect(element.classList.contains('ct-alert--warning')).toBe(true);
    expect(element.classList.contains('custom-class')).toBe(true);
    expect(element.getAttribute('data-test')).toEqual('true');
    expect(element.getAttribute('data-alert-id')).toEqual('alert-1');
    expect(element.getAttribute('data-alert-type')).toEqual('warning');
    expect(c.querySelector('.ct-alert__title').textContent.trim()).toEqual('Warning Alert');
    expect(c.querySelector('.ct-alert__summary').textContent.trim()).toEqual('This is a warning alert.');
    expect(c.querySelector('.ct-alert__dismiss-button')).not.toBeNull();
    assertUniqueCssClasses(c);
  });

  test('does not render when description is empty', async () => {
    const c = await dom(template, {
      description: '',
    });

    expect(c.querySelectorAll('.ct-alert')).toHaveLength(0);
  });

  test('renders with correct icon for alert type', async () => {
    const c = await dom(template, {
      description: 'This is a success alert.',
      type: 'success',
    });

    expect(c.querySelector('.ct-alert--success')).not.toBeNull();
    expect(c.querySelector('.ct-icon')).not.toBeNull();
    assertUniqueCssClasses(c);
  });
});
