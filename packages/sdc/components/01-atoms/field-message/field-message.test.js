const template = 'components/01-atoms/field-message/field-message.twig';

describe('Field Message Component', () => {
  test('renders with default values', async () => {
    const c = await dom(template, {
      content: 'This is a message',
    });

    expect(c.querySelectorAll('.ct-field-message.ct-theme-light.ct-field-message--information')).toHaveLength(1);
    expect(c.querySelector('.ct-field-message').textContent.trim()).toEqual('This is a message');

    assertUniqueCssClasses(c);
  });

  test('renders with custom theme and type', async () => {
    const c = await dom(template, {
      content: 'This is an error message',
      theme: 'dark',
      type: 'error',
    });

    expect(c.querySelectorAll('.ct-field-message.ct-theme-dark.ct-field-message--error')).toHaveLength(1);
    expect(c.querySelector('.ct-field-message').textContent.trim()).toEqual('This is an error message');

    assertUniqueCssClasses(c);
  });

  test('renders with additional attributes and classes', async () => {
    const c = await dom(template, {
      content: 'This is a message',
      attributes: 'data-test="true"',
      modifier_class: 'custom-modifier',
    });

    expect(c.querySelectorAll('.ct-field-message.ct-theme-light.ct-field-message--information.custom-modifier')).toHaveLength(1);
    expect(c.querySelector('.ct-field-message').getAttribute('data-test')).toEqual('true');
    expect(c.querySelector('.ct-field-message').textContent.trim()).toEqual('This is a message');

    assertUniqueCssClasses(c);
  });

  test('does not render when content is empty', async () => {
    const c = await dom(template, {
      content: '',
    });

    expect(c.querySelectorAll('.ct-field-message')).toHaveLength(0);
  });

  test('renders with icons', async () => {
    const c = await dom(template, {
      content: 'This is a warning message',
      type: 'warning',
    });

    expect(c.querySelectorAll('.ct-field-message.ct-theme-light.ct-field-message--warning')).toHaveLength(1);
    expect(c.querySelector('.ct-field-message').textContent.trim()).toEqual('This is a warning message');
    expect(c.querySelectorAll('.ct-field-message__icon')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });
});
