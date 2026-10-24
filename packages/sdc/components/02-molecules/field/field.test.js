import DrupalAttribute from '@civictheme/drupal-attribute';

const template = 'components/02-molecules/field/field.twig';

describe('Field Component', () => {
  test('default values', async () => {
    const c = await dom(template, {});

    // Default classes.
    expect(c.querySelectorAll('.ct-field.ct-theme-light.ct-field--vertical')).toHaveLength(1);
    expect(c.querySelectorAll('div.ct-field')).toHaveLength(1);

    // Default field type.
    expect(c.querySelectorAll('.ct-field.ct-field--hidden')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('control slot renders as a direct child of the field root', async () => {
    const c = await dom(template, {
      type: 'textfield',
      control: '<input type="text" name="slotted" id="testid" class="external-control">',
    });

    expect(c.querySelectorAll('.ct-field > input.external-control[name="slotted"]')).toHaveLength(1);

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
    expect(c.querySelectorAll('.ct-field > .ct-field__description')).toHaveLength(1);
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

    expect(c.querySelectorAll('.ct-field > .ct-label.ct-field__title[for="testid"]')).toHaveLength(1);
    expect(c.querySelector('.ct-field .ct-label.ct-field__title').textContent.trim()).toEqual('Test Title (required)');

    assertUniqueCssClasses(c);
  });

  describe('option groups (is_group)', () => {
    test('the root element is a fieldset and the title renders as its legend', async () => {
      for (const type of ['checkbox', 'radio']) {
        const c = await dom(template, {
          type,
          is_group: true,
          title: 'Test Title',
          id: 'testid',
          control: `<input type="${type}" name="testname" id="testid">`,
        }, false);

        expect(c.querySelectorAll('fieldset.ct-field.ct-field--group')).toHaveLength(1);
        expect(c.querySelectorAll('fieldset.ct-field > legend.ct-label.ct-field__title')).toHaveLength(1);
        expect(c.querySelector('legend.ct-field__title').textContent.trim()).toEqual('Test Title');
        expect(c.querySelectorAll('.ct-field .ct-label[for]')).toHaveLength(0);

        assertUniqueCssClasses(c);
      }
    });

    test('attributes render on the fieldset root', async () => {
      const c = await dom(template, {
        type: 'checkbox',
        is_group: true,
        title: 'Test Title',
        attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
        control: '<input type="checkbox" name="testname">',
      });

      expect(c.querySelectorAll('fieldset.ct-field[data-test="true"]')).toHaveLength(1);

      assertUniqueCssClasses(c);
    });

    test('a hidden group title degrades to a visually hidden legend, keeping the fieldset', async () => {
      for (const titleDisplay of ['hidden', 'none']) {
        const c = await dom(template, {
          type: 'checkbox',
          is_group: true,
          title: 'Test Title',
          title_display: titleDisplay,
          control: '<input type="checkbox" name="testname">',
        }, false);

        expect(c.querySelectorAll('fieldset.ct-field')).toHaveLength(1);
        expect(c.querySelectorAll('legend.ct-field__title.ct-visually-hidden')).toHaveLength(1);

        assertUniqueCssClasses(c);
      }
    });

    test('a group without a title renders the fieldset without a legend', async () => {
      const c = await dom(template, {
        type: 'checkbox',
        is_group: true,
        title: '',
        control: '<input type="checkbox" name="testname">',
      });

      expect(c.querySelectorAll('fieldset.ct-field')).toHaveLength(1);
      expect(c.querySelectorAll('legend')).toHaveLength(0);

      assertUniqueCssClasses(c);
    });

    test('the group description renders after the legend', async () => {
      const c = await dom(template, {
        type: 'checkbox',
        is_group: true,
        title: 'Test Title',
        id: 'testid',
        description: 'This is a description',
        control: '<input type="checkbox" name="testname">',
      });

      const root = c.querySelector('fieldset.ct-field');
      expect(root.innerHTML.indexOf('ct-field__title')).toBeLessThan(root.innerHTML.indexOf('ct-field__description'));
      expect(root.innerHTML.indexOf('ct-field__description')).toBeLessThan(root.innerHTML.indexOf('<input'));
      expect(c.querySelectorAll('.ct-field__description[id="testid--description"]')).toHaveLength(1);

      assertUniqueCssClasses(c);
    });
  });

  test('a single checkbox or radio renders a label beside the control, not a fieldset', async () => {
    for (const type of ['checkbox', 'radio']) {
      const c = await dom(template, {
        type,
        title: 'Test Title',
        id: 'testid',
        control: `<input type="${type}" name="testname" id="testid">`,
      }, false);

      expect(c.querySelectorAll('fieldset')).toHaveLength(0);
      expect(c.querySelectorAll('legend')).toHaveLength(0);
      expect(c.querySelectorAll('.ct-field > label.ct-field__label[for="testid"]')).toHaveLength(1);

      assertUniqueCssClasses(c);
    }
  });

  test('an explicit before position renders the single checkbox label above the control', async () => {
    const c = await dom(template, {
      type: 'checkbox',
      title: 'Test Title',
      title_position: 'before',
      id: 'testid',
      control: '<input type="checkbox" name="testname" id="testid">',
    });

    expect(c.querySelectorAll('fieldset')).toHaveLength(0);
    expect(c.querySelectorAll('.ct-field > label.ct-field__title[for="testid"]')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('a hidden single checkbox title degrades to a visually hidden label', async () => {
    const c = await dom(template, {
      type: 'checkbox',
      title: 'Test Title',
      title_display: 'hidden',
      id: 'testid',
      control: '<input type="checkbox" name="testname" id="testid">',
    });

    expect(c.querySelectorAll('.ct-field > label.ct-field__label.ct-visually-hidden[for="testid"]')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('prefix and suffix', async () => {
    const c = await dom(template, {
      type: 'textfield',
      prefix: 'Prefix content',
      suffix: 'Suffix content',
      control: '<input type="text" name="testname">',
    });

    expect(c.querySelector('.ct-field > .ct-field__prefix').textContent.trim()).toEqual('Prefix content');
    expect(c.querySelector('.ct-field > .ct-field__suffix').textContent.trim()).toEqual('Suffix content');

    assertUniqueCssClasses(c);
  });

  describe('title_position after (single checkbox/radio layout)', () => {
    test('renders the label directly after the control, with the description below', async () => {
      const c = await dom(template, {
        type: 'checkbox',
        title: 'Agree to the terms',
        title_position: 'after',
        id: 'testid',
        is_required: true,
        description: 'This is a description',
        control: '<input type="checkbox" name="agree" id="testid">',
      });

      expect(c.querySelectorAll('fieldset')).toHaveLength(0);
      expect(c.querySelectorAll('legend')).toHaveLength(0);

      const root = c.querySelector('.ct-field');
      expect(root.querySelectorAll(':scope > input[name="agree"]')).toHaveLength(1);
      expect(root.querySelectorAll(':scope > label.ct-field__label[for="testid"]')).toHaveLength(1);
      expect(root.querySelector('label').textContent).toContain('Agree to the terms');
      expect(root.querySelector('label').textContent).toContain('(required)');
      // The label follows the control in document order.
      expect(root.innerHTML.indexOf('<input')).toBeLessThan(root.innerHTML.indexOf('<label'));

      // The description renders after the control and label.
      expect(root.innerHTML.indexOf('<label')).toBeLessThan(root.innerHTML.indexOf('ct-field__description'));
      expect(c.querySelectorAll('.ct-field > .ct-field__description[id="testid--description"]')).toHaveLength(1);

      assertUniqueCssClasses(c);
    });

    test('invisible title renders a visually hidden label after the control', async () => {
      const c = await dom(template, {
        type: 'checkbox',
        title: 'Hidden title',
        title_position: 'after',
        title_display: 'invisible',
        id: 'testid',
        control: '<input type="checkbox" name="agree" id="testid">',
      });

      expect(c.querySelectorAll('.ct-field > label.ct-field__label.ct-visually-hidden[for="testid"]')).toHaveLength(1);

      assertUniqueCssClasses(c);
    });
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

    test('message receives an id derived from the field id when no attributes are provided', async () => {
      const c = await dom(template, {
        type: 'textfield',
        id: 'testid',
        is_invalid: true,
        message: {
          content: 'Message content sample.',
        },
        control: '<input type="text" name="testname" id="testid" aria-describedby="testid--error-message">',
      });

      expect(c.querySelectorAll('.ct-field .ct-field__message[id="testid--error-message"]')).toHaveLength(1);

      assertUniqueCssClasses(c);
    });

    test('message has no derived id without a field id, and explicit message attributes win', async () => {
      const withoutId = await dom(template, {
        type: 'textfield',
        is_invalid: true,
        message: { content: 'Message content sample.' },
        control: '<input type="text" name="testname">',
      });
      expect(withoutId.querySelectorAll('.ct-field .ct-field__message[id]')).toHaveLength(0);

      const withExplicitAttributes = await dom(template, {
        type: 'textfield',
        id: 'testid',
        is_invalid: true,
        message: {
          content: 'Message content sample.',
          attributes: new DrupalAttribute().setAttribute('id', 'custom-id'),
        },
        control: '<input type="text" name="testname" id="testid">',
      });
      expect(withExplicitAttributes.querySelectorAll('.ct-field .ct-field__message[id="custom-id"]')).toHaveLength(1);
      expect(withExplicitAttributes.querySelectorAll('.ct-field .ct-field__message[id="testid--error-message"]')).toHaveLength(0);
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
    // Drupal form vocabulary is accepted and normalised.
    { title: 'Test Title', titleDisplay: 'before', type: 'textfield', expected: 1, selector: '.ct-field__title', description: 'drupal "before" renders a visible title' },
    { title: 'Test Title', titleDisplay: 'inline', type: 'textfield', expected: 1, selector: '.ct-field__title', description: 'drupal "inline" renders a visible title' },
    { title: 'Test Title', titleDisplay: 'visually_hidden', type: 'textfield', expected: 1, selector: '.ct-field__title.ct-visually-hidden', description: 'drupal "visually_hidden" renders an invisible title' },
    { title: 'Test Title', titleDisplay: 'none', type: 'textfield', expected: 0, selector: '.ct-field__title', description: 'drupal "none" renders no title' },
    { title: 'Test Title', titleDisplay: 'attribute', type: 'textfield', expected: 0, selector: '.ct-field__title', description: 'drupal "attribute" renders no title' },
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

  describe('drupal title_display vocabulary side effects', () => {
    test('"after" places the title after the control without an explicit title_position', async () => {
      const c = await dom(template, {
        type: 'checkbox',
        title: 'Agree to the terms',
        title_display: 'after',
        id: 'testid',
        control: '<input type="checkbox" name="agree" id="testid">',
      });

      const root = c.querySelector('.ct-field');
      expect(root.querySelectorAll(':scope > label.ct-field__label[for="testid"]')).toHaveLength(1);
      expect(root.innerHTML.indexOf('<input')).toBeLessThan(root.innerHTML.indexOf('<label'));
      expect(c.querySelectorAll('fieldset')).toHaveLength(0);

      assertUniqueCssClasses(c);
    });

    test('"inline" renders a horizontal field without an explicit orientation', async () => {
      const c = await dom(template, {
        type: 'textfield',
        title: 'Inline title',
        title_display: 'inline',
        control: '<input type="text" name="testname">',
      });

      expect(c.querySelectorAll('.ct-field.ct-field--horizontal')).toHaveLength(1);
      expect(c.querySelectorAll('.ct-field__title')).toHaveLength(1);

      assertUniqueCssClasses(c);
    });

    test('explicit title_position and orientation win over the title_display vocabulary', async () => {
      const c = await dom(template, {
        type: 'textfield',
        title: 'Test Title',
        title_display: 'after',
        title_position: 'before',
        orientation: 'vertical',
        control: '<input type="text" name="testname">',
      });

      expect(c.querySelectorAll('.ct-field.ct-field--vertical')).toHaveLength(1);
      expect(c.querySelectorAll('.ct-field > .ct-label.ct-field__title')).toHaveLength(1);
      expect(c.querySelectorAll('.ct-field .ct-field__label')).toHaveLength(0);

      assertUniqueCssClasses(c);
    });
  });
});
