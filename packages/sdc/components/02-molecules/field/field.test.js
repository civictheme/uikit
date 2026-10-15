import DrupalAttribute from '@civictheme/drupal-attribute';

const template = 'components/02-molecules/field/field.twig';

describe('Field Component', () => {
  test('default values', async () => {
    const c = await dom(template, {});

    // Default classes.
    expect(c.querySelectorAll('.ct-field.ct-theme-light.ct-field--vertical')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field .ct-field__wrapper')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field .ct-field__control')).toHaveLength(1);

    // Default field type.
    expect(c.querySelectorAll('.ct-field.ct-field--hidden')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('control slot renders inside the control wrapper', async () => {
    const c = await dom(template, {
      type: 'textfield',
      control: '<input type="text" name="slotted" id="testid" class="external-control">',
    });

    expect(c.querySelectorAll('.ct-field .ct-field__control input.external-control[name="slotted"]')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('theme, orientation, and invalid state', async () => {
    const c = await dom(template, {
      type: 'textfield',
      theme: 'dark',
      is_invalid: true,
      orientation: 'horizontal',
      control: '<input type="text" name="testname">',
    });
    expect(c.querySelectorAll('.ct-field.ct-theme-dark.ct-field--horizontal.ct-field--invalid')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field.ct-field--textfield')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field .ct-field__wrapper')).toHaveLength(1);
    assertUniqueCssClasses(c);
  });

  test('wrapper attributes and modifier class', async () => {
    const c = await dom(template, {
      type: 'textfield',
      modifier_class: 'custom-modifier',
      attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
      control: '<input type="text" name="testname">',
    });

    expect(c.querySelectorAll('.ct-field.custom-modifier')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field[data-test="true"]')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('required, disabled, and description', async () => {
    const c = await dom(template, {
      type: 'textfield',
      is_required: true,
      is_disabled: true,
      description: 'This is a description',
      control: '<input type="text" name="testname">',
    });
    expect(c.querySelectorAll('.ct-field.ct-theme-light.ct-field--vertical.ct-field--required.ct-field--disabled')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field .ct-field__wrapper')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field .ct-field__description')).toHaveLength(1);
    expect(c.querySelector('.ct-field .ct-field__description').textContent.trim()).toEqual('This is a description');
    assertUniqueCssClasses(c);
  });

  test('title is linked to the control id and carries the required marker', async () => {
    const c = await dom(template, {
      type: 'textfield',
      title: 'Test Title',
      id: 'testid',
      is_required: true,
      control: '<input type="text" name="testname" id="testid">',
    });

    expect(c.querySelectorAll('.ct-field .ct-label.ct-field__title[for="testid"]')).toHaveLength(1);
    expect(c.querySelector('.ct-field .ct-label.ct-field__title').textContent.trim()).toEqual('Test Title (required)');

    assertUniqueCssClasses(c);
  });

  test('checkbox and radio types render the title as a legend in a fieldset wrapper', async () => {
    for (const type of ['checkbox', 'radio']) {
      const c = await dom(template, {
        type,
        title: 'Test Title',
        id: 'testid',
        control: `<input type="${type}" name="testname" id="testid">`,
      }, false);

      expect(c.querySelectorAll('.ct-field fieldset.ct-field__wrapper')).toHaveLength(1);
      expect(c.querySelectorAll('.ct-field legend.ct-label.ct-field__title')).toHaveLength(1);
      expect(c.querySelector('.ct-field legend.ct-label.ct-field__title').textContent.trim()).toEqual('Test Title');
      expect(c.querySelectorAll('.ct-field .ct-label[for]')).toHaveLength(0);

      assertUniqueCssClasses(c);
    }
  });

  test('prefix and suffix', async () => {
    const c = await dom(template, {
      type: 'textfield',
      prefix: 'Prefix content',
      suffix: 'Suffix content',
      control: '<input type="text" name="testname">',
    });

    expect(c.querySelector('.ct-field .ct-field__prefix').textContent.trim()).toEqual('Prefix content');
    expect(c.querySelector('.ct-field .ct-field__suffix').textContent.trim()).toEqual('Suffix content');

    assertUniqueCssClasses(c);
  });

  describe('description references', () => {
    test('description receives an id derived from the field id', async () => {
      const c = await dom(template, {
        type: 'textfield',
        id: 'testid',
        description: 'This is a description',
        control: '<input type="text" name="testname" id="testid" aria-describedby="testid--description">',
      });

      expect(c.querySelectorAll('.ct-field .ct-field__description[id="testid--description"]')).toHaveLength(1);

      assertUniqueCssClasses(c);
    });

    test('description has no id without a field id', async () => {
      const c = await dom(template, {
        type: 'textfield',
        description: 'This is a description',
        control: '<input type="text" name="testname">',
      });

      expect(c.querySelectorAll('.ct-field .ct-field__description')).toHaveLength(1);
      expect(c.querySelectorAll('.ct-field .ct-field__description[id]')).toHaveLength(0);

      assertUniqueCssClasses(c);
    });
  });

  describe('field messages', () => {
    test('message renders with content and attributes', async () => {
      const c = await dom(template, {
        type: 'textfield',
        message: {
          content: 'Message content sample.',
          attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
        },
        control: '<input type="text" name="testname">',
      });

      const messageElement = c.querySelector('.ct-field .ct-field__message');
      expect(messageElement).not.toBeNull();
      expect(messageElement.textContent.trim()).toBe('Message content sample.');
      expect(messageElement.getAttribute('data-test')).toBe('true');
      assertUniqueCssClasses(c);
    });

    test('default message renders when field is invalid without message object and no field title', async () => {
      const c = await dom(template, {
        type: 'textfield',
        is_invalid: true,
        control: '<input type="text" name="testname">',
      });

      const messageElement = c.querySelector('.ct-field .ct-field__message');
      expect(messageElement).not.toBeNull();
      expect(messageElement.textContent.trim()).toBe('Field has an error');
      expect(c.querySelectorAll('.ct-field--invalid')).toHaveLength(1);
      assertUniqueCssClasses(c);
    });

    test('default message renders when message object has no content and title is present', async () => {
      const c = await dom(template, {
        title: 'Test input',
        type: 'textfield',
        is_invalid: true,
        message: {
          attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
        },
        control: '<input type="text" name="testname">',
      });

      const messageElement = c.querySelector('.ct-field .ct-field__message');
      expect(messageElement).not.toBeNull();
      expect(messageElement.textContent.trim()).toBe('Field Test input has an error');
      expect(messageElement.getAttribute('data-test')).toBe('true');
      expect(c.querySelectorAll('.ct-field--invalid')).toHaveLength(1);
      assertUniqueCssClasses(c);
    });

    test('no message or description renders for the hidden type', async () => {
      const c = await dom(template, {
        type: 'hidden',
        title: 'Test Title',
        description: 'This is a description',
        is_invalid: true,
        control: '<input type="hidden" name="testname">',
      });

      expect(c.querySelectorAll('.ct-field .ct-field__message')).toHaveLength(0);
      expect(c.querySelectorAll('.ct-field .ct-field__description')).toHaveLength(0);
      expect(c.querySelectorAll('.ct-field .ct-field__title')).toHaveLength(0);
      assertUniqueCssClasses(c);
    });
  });

  describe.each([
    { title: 'Test Title', titleDisplay: 'visible', type: 'textfield', expected: 1, selector: '.ct-field__title', description: 'visible title with textfield' },
    { title: 'Test Title', titleDisplay: 'invisible', type: 'textfield', expected: 1, selector: '.ct-field__title.ct-visually-hidden', description: 'invisible title with textfield' },
    { title: 'Test Title', titleDisplay: 'hidden', type: 'textfield', expected: 0, selector: '.ct-field__title', description: 'hidden title with textfield' },
    { title: '', titleDisplay: 'visible', type: 'textfield', expected: 0, selector: '.ct-field__title', description: 'empty title with textfield' },
    { title: 'Test Title', titleDisplay: 'visible', type: 'hidden', expected: 0, selector: '.ct-field__title', description: 'visible title with hidden input' },
    { title: 'Test Title', titleDisplay: 'hidden', type: 'hidden', expected: 0, selector: '.ct-field__title', description: 'hidden title with hidden input' },
  ])('Field Component - $description', ({ title, titleDisplay, type, expected, selector }) => {
    test(`renders ${expected} title(s)`, async () => {
      const c = await dom(template, {
        title,
        title_display: titleDisplay,
        type,
        control: '<input type="text" name="testname">',
      });

      expect(c.querySelectorAll(selector)).toHaveLength(expected);
    });
  });
});
