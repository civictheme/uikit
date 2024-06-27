const template = 'components/02-molecules/field/field.twig';

describe('Field Component', () => {
  test('nothing is rendered if name is not provided', async () => {
    const c = await dom(template, { other: 'test' });

    expect(c.querySelectorAll('.ct-field')).toHaveLength(0);
  });

  test('default values', async () => {
    const c = await dom(template, {
      name: 'test',
    });

    // Default classes.
    expect(c.querySelectorAll('.ct-field.ct-theme-light.ct-field--vertical')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field .ct-field__wrapper')).toHaveLength(1);

    // Default field type.
    expect(c.querySelectorAll('.ct-field.ct-field--hidden')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[type="hidden"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[type="hidden"].ct-input.ct-theme-light.ct-field__control')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('values', async () => {
    const c = await dom(template, {
      name: 'testname',
      value: 'testvalue',
    });

    expect(c.querySelectorAll('.ct-field.ct-theme-light.ct-field--vertical')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field .ct-field__wrapper')).toHaveLength(1);

    expect(c.querySelectorAll('.ct-field.ct-field--hidden')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[type="hidden"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[type="hidden"].ct-input.ct-theme-light.ct-field__control')).toHaveLength(1);

    expect(c.querySelectorAll('.ct-field input[type="hidden"][name="testname"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[type="hidden"][name="testname"][value="testvalue"]')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('theme, orientation, and invalid state', async () => {
    const c = await dom(template, {
      name: 'testname',
      type: 'textfield',
      theme: 'dark',
      is_invalid: true,
      orientation: 'horizontal',
    });
    expect(c.querySelectorAll('.ct-field.ct-theme-dark.ct-field--horizontal.ct-field--invalid')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[type="text"].ct-textfield.ct-theme-dark.ct-field__control')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field .ct-field__wrapper')).toHaveLength(1);
    assertUniqueCssClasses(c);
  });

  test('required, disabled, and description', async () => {
    const c = await dom(template, {
      name: 'testname',
      type: 'textfield',
      is_required: true,
      is_disabled: true,
      description: 'This is a description',
    });
    expect(c.querySelectorAll('.ct-field.ct-theme-light.ct-field--vertical.ct-field--required.ct-field--disabled')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field .ct-field__wrapper')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[type="text"].ct-textfield.ct-theme-light.ct-field__control')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field .ct-field__description')).toHaveLength(1);
    expect(c.querySelector('.ct-field .ct-field__description').textContent.trim()).toEqual('This is a description');
    assertUniqueCssClasses(c);
  });

  test('textfield', async () => {
    const c = await dom(template, {
      type: 'textfield',
      title: 'Test Title',
      name: 'testname',
      value: 'testvalue',
      id: 'testid',
      modifier_class: 'custom-modifier',
      attributes: 'data-test="true"',
    });

    expect(c.querySelectorAll('.ct-field.ct-theme-light.ct-field--vertical')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field .ct-field__wrapper')).toHaveLength(1);

    expect(c.querySelectorAll('.ct-field.ct-field--textfield')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[type="text"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[type="text"].ct-textfield.ct-theme-light.ct-field__control')).toHaveLength(1);

    expect(c.querySelectorAll('.ct-field input[type="text"][name="testname"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[type="text"][name="testname"][value="testvalue"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[type="text"][name="testname"][id="testid"]')).toHaveLength(1);

    expect(c.querySelectorAll('.ct-field[data-test="true"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[data-test="true"]')).toHaveLength(0);
    expect(c.querySelectorAll('.ct-field.custom-modifier')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input.custom-modifier')).toHaveLength(0);

    expect(c.querySelector('.ct-field .ct-label.ct-field__title').textContent.trim()).toEqual('Test Title');
    expect(c.querySelectorAll('.ct-field .ct-label[for="testid"]')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('single control as object propagation', async () => {
    const c = await dom(template, {
      type: 'textfield',
      title: 'Test Title',
      control: {
        name: 'testname',
        value: 'testvalue',
        id: 'testid',
        modifier_class: 'custom-modifier',
        attributes: 'data-test="true"',
      },
    });
    expect(c.innerHTML).toContain('ct-field');

    expect(c.querySelectorAll('.ct-field.ct-theme-light.ct-field--vertical')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field .ct-field__wrapper')).toHaveLength(1);

    expect(c.querySelectorAll('.ct-field.ct-field--textfield')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[type="text"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[type="text"].ct-textfield.ct-theme-light.ct-field__control')).toHaveLength(1);

    expect(c.querySelectorAll('.ct-field input[type="text"][name="testname"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[type="text"][name="testname"][value="testvalue"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[type="text"][name="testname"][id="testid"]')).toHaveLength(1);

    expect(c.querySelectorAll('.ct-field[data-test="true"]')).toHaveLength(0);
    expect(c.querySelectorAll('.ct-field input[data-test="true"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field.custom-modifier')).toHaveLength(0);
    expect(c.querySelectorAll('.ct-field input.custom-modifier')).toHaveLength(1);

    expect(c.querySelector('.ct-field .ct-label.ct-field__title').textContent.trim()).toEqual('Test Title');
    expect(c.querySelectorAll('.ct-field .ct-label[for="testid"]')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('single control as array propagation', async () => {
    const c = await dom(template, {
      type: 'textfield',
      title: 'Test Title',
      control: [{
        name: 'testname',
        value: 'testvalue',
        id: 'testid',
        modifier_class: 'custom-modifier',
        attributes: 'data-test="true"',
      }],
    });
    expect(c.innerHTML).toContain('ct-field');

    expect(c.querySelectorAll('.ct-field.ct-theme-light.ct-field--vertical')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field .ct-field__wrapper')).toHaveLength(1);

    expect(c.querySelectorAll('.ct-field.ct-field--textfield')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[type="text"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[type="text"].ct-textfield.ct-theme-light.ct-field__control')).toHaveLength(1);

    expect(c.querySelectorAll('.ct-field input[type="text"][name="testname"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[type="text"][name="testname"][value="testvalue"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[type="text"][name="testname"][id="testid"]')).toHaveLength(1);

    expect(c.querySelectorAll('.ct-field[data-test="true"]')).toHaveLength(0);
    expect(c.querySelectorAll('.ct-field input[data-test="true"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field.custom-modifier')).toHaveLength(0);
    expect(c.querySelectorAll('.ct-field input.custom-modifier')).toHaveLength(1);

    expect(c.querySelector('.ct-field .ct-label.ct-field__title').textContent.trim()).toEqual('Test Title');
    expect(c.querySelectorAll('.ct-field .ct-label[for="testid"]')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('multiple control as array propagation - textfield', async () => {
    const c = await dom(template, {
      type: 'textfield',
      title: 'Test Title',
      control: [
        {
          name: 'testname',
          value: 'testvalue',
          id: 'testid',
          modifier_class: 'custom-modifier',
          attributes: 'data-test="true"',
        },
        {
          name: 'testname2',
          value: 'testvalue2',
          id: 'testid2',
          modifier_class: 'custom-modifier2',
          attributes: 'data-test="false"',
        },
      ],
    });
    expect(c.innerHTML).toContain('ct-field');

    expect(c.querySelectorAll('.ct-field.ct-theme-light.ct-field--vertical')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field .ct-field__wrapper')).toHaveLength(1);

    expect(c.querySelectorAll('.ct-field input[type="text"][name="testname"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[type="text"][name="testname2"]')).toHaveLength(0);

    assertUniqueCssClasses(c);
  });

  test('multiple control as array propagation - checkbox', async () => {
    const c = await dom(template, {
      type: 'checkbox',
      title: 'Test Title',
      control: [
        {
          name: 'testname',
          value: 'testvalue',
          id: 'testid',
          modifier_class: 'custom-modifier',
          attributes: 'data-test="true"',
        },
        {
          name: 'testname',
          value: 'testvalue2',
          id: 'testid2',
          modifier_class: 'custom-modifier2',
          attributes: 'data-test="false"',
        },
      ],
    });
    expect(c.innerHTML).toContain('ct-field');

    expect(c.querySelectorAll('.ct-field.ct-theme-light.ct-field--vertical')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field .ct-field__wrapper')).toHaveLength(1);

    expect(c.querySelectorAll('.ct-field input[type="checkbox"][name="testname"]')).toHaveLength(2);
    expect(c.querySelectorAll('.ct-field input[type="checkbox"][name="testname"][value="testvalue"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[type="checkbox"][name="testname"][id="testid"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[type="checkbox"][name="testname"][value="testvalue2"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[type="checkbox"][name="testname"][id="testid2"]')).toHaveLength(1);

    expect(c.querySelector('.ct-field .ct-label.ct-field__title').textContent.trim()).toEqual('Test Title');
    expect(c.querySelectorAll('.ct-field .ct-label[for="testid"]')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('multiple control as array propagation with mixed levels - checkbox', async () => {
    const c = await dom(template, {
      type: 'checkbox',
      title: 'Test Title',
      name: 'testname',
      id: 'testid',
      modifier_class: 'custom-modifier-parent',
      attributes: 'data-test-parent="true"',
      control: [
        {
          label: 'Checkbox 1',
          value: 'testvalue',
          id: 'testid1',
          modifier_class: 'custom-modifier-nested1',
          attributes: 'data-test-nested1="true"',
        },
        {
          label: 'Checkbox 2',
          value: 'testvalue2',
          id: 'testid2',
        },
      ],
    });
    expect(c.innerHTML).toContain('ct-field');

    expect(c.querySelectorAll('.ct-field.ct-theme-light.ct-field--vertical')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field .ct-field__wrapper')).toHaveLength(1);

    expect(c.querySelectorAll('.ct-field input[type="checkbox"][name="testname"]')).toHaveLength(2);
    expect(c.querySelectorAll('.ct-field input[type="checkbox"][name="testname"][value="testvalue"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[type="checkbox"][name="testname"][value="testvalue2"]')).toHaveLength(1);

    // Parent ids are not propagated to the nested elements - nested elements
    // must provide their own ids.
    expect(c.querySelectorAll('.ct-field input[type="checkbox"][name="testname"][id="testid"]')).toHaveLength(0);
    expect(c.querySelectorAll('.ct-field input[type="checkbox"][name="testname"][id="testid1"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[type="checkbox"][name="testname"][id="testid2"]')).toHaveLength(1);

    // expect(container.innerHTML).toContain('ct-field1');
    // Do not propagate the attributes to the nested elements.
    expect(c.querySelectorAll('.ct-field[data-test-parent="true"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[data-test-nested1="true"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[data-test-parent="true"]')).toHaveLength(0);
    // Do not propagate the classes to the nested elements.
    expect(c.querySelectorAll('.ct-field.custom-modifier-parent')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input.custom-modifier-nested1')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input.custom-modifier-parent')).toHaveLength(0);

    // Do not use [for] on label when multiple controls passed.
    expect(c.querySelectorAll('.ct-field .ct-label.ct-field__title')).toHaveLength(1);
    expect(c.querySelector('.ct-field .ct-label.ct-field__title').textContent.trim()).toEqual('Test Title');
    expect(c.querySelectorAll('.ct-field .ct-label.ct-checkbox__label[for="testid1"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field .ct-label.ct-checkbox__label[for="testid2"]')).toHaveLength(1);
    expect(c.querySelector('.ct-field .ct-label.ct-checkbox__label[for="testid1"]').textContent.trim()).toEqual('Checkbox 1');
    expect(c.querySelector('.ct-field .ct-label.ct-checkbox__label[for="testid2"]').textContent.trim()).toEqual('Checkbox 2');

    assertUniqueCssClasses(c);
  });

  test('textarea with all attributes', async () => {
    const c = await dom(template, {
      type: 'textarea',
      title: 'Test Title',
      name: 'testname',
      value: 'testvalue',
      id: 'testid',
      is_required: true,
      is_invalid: true,
      attributes: 'data-test="true"',
      modifier_class: 'custom-modifier',
    });

    expect(c.querySelectorAll('.ct-field.ct-theme-light.ct-field--vertical.ct-field--required.ct-field--invalid')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field .ct-field__wrapper')).toHaveLength(1);

    expect(c.querySelectorAll('.ct-field.ct-field--textarea')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field textarea')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field textarea.ct-textarea.ct-theme-light.ct-field__control')).toHaveLength(1);

    expect(c.querySelectorAll('.ct-field textarea[name="testname"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field textarea[name="testname"][id="testid"]')).toHaveLength(1);

    expect(c.querySelectorAll('.ct-field[data-test="true"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field textarea[data-test="true"]')).toHaveLength(0);
    expect(c.querySelectorAll('.ct-field.custom-modifier')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field textarea.custom-modifier')).toHaveLength(0);

    expect(c.querySelector('.ct-field .ct-label.ct-field__title').textContent.trim()).toEqual('Test Title');
    expect(c.querySelectorAll('.ct-field .ct-label[for="testid"]')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('select', async () => {
    const c = await dom(template, {
      type: 'select',
      title: 'Test Title',
      name: 'testname',
      value: 'testvalue',
      id: 'testid',
      options: [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
      ],
      modifier_class: 'custom-modifier',
      attributes: 'data-test="true"',
    });

    expect(c.querySelectorAll('.ct-field.ct-theme-light.ct-field--vertical')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field .ct-field__wrapper')).toHaveLength(1);

    expect(c.querySelectorAll('.ct-field.ct-field--select')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field select')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field select.ct-select.ct-theme-light.ct-field__control')).toHaveLength(1);

    expect(c.querySelectorAll('.ct-field select[name="testname"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field select[name="testname"][id="testid"]')).toHaveLength(1);

    expect(c.querySelectorAll('.ct-field[data-test="true"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field select[data-test="true"]')).toHaveLength(0);
    expect(c.querySelectorAll('.ct-field.custom-modifier')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field select.custom-modifier')).toHaveLength(0);

    expect(c.querySelector('.ct-field .ct-label.ct-field__title').textContent.trim()).toEqual('Test Title');
    expect(c.querySelectorAll('.ct-field .ct-label[for="testid"]')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('radio', async () => {
    const c = await dom(template, {
      type: 'radio',
      title: 'Test Title',
      control: [
        {
          name: 'testname',
          value: 'testvalue',
          id: 'testid',
          modifier_class: 'custom-modifier',
          attributes: 'data-test="true"',
        },
        {
          name: 'testname',
          value: 'testvalue2',
          id: 'testid2',
          modifier_class: 'custom-modifier2',
          attributes: 'data-test="false"',
        },
      ],
    });
    expect(c.innerHTML).toContain('ct-field');

    expect(c.querySelectorAll('.ct-field.ct-theme-light.ct-field--vertical')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field .ct-field__wrapper')).toHaveLength(1);

    expect(c.querySelectorAll('.ct-field input[type="radio"][name="testname"]')).toHaveLength(2);
    expect(c.querySelectorAll('.ct-field input[type="radio"][name="testname"][value="testvalue"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[type="radio"][name="testname"][id="testid"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[type="radio"][name="testname"][value="testvalue2"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[type="radio"][name="testname"][id="testid2"]')).toHaveLength(1);

    expect(c.querySelector('.ct-field .ct-label.ct-field__title').textContent.trim()).toEqual('Test Title');
    expect(c.querySelectorAll('.ct-field .ct-label[for="testid"]')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('default input', async () => {
    const c = await dom(template, {
      type: 'email',
      title: 'Test Title',
      name: 'testname',
      value: 'testvalue',
      id: 'testid',
      modifier_class: 'custom-modifier',
      attributes: 'data-test="true"',
    });

    expect(c.querySelectorAll('.ct-field.ct-theme-light.ct-field--vertical')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field .ct-field__wrapper')).toHaveLength(1);

    expect(c.querySelectorAll('.ct-field input[type="email"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[type="email"].ct-input.ct-theme-light.ct-field__control')).toHaveLength(1);

    expect(c.querySelectorAll('.ct-field input[type="email"][name="testname"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[type="email"][name="testname"][value="testvalue"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[type="email"][name="testname"][id="testid"]')).toHaveLength(1);

    expect(c.querySelectorAll('.ct-field[data-test="true"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input[data-test="true"]')).toHaveLength(0);
    expect(c.querySelectorAll('.ct-field.custom-modifier')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-field input.custom-modifier')).toHaveLength(0);

    expect(c.querySelector('.ct-field .ct-label.ct-field__title').textContent.trim()).toEqual('Test Title');
    expect(c.querySelectorAll('.ct-field .ct-label[for="testid"]')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  describe.each([
    { title: 'Test Title', titleDisplay: 'visible', type: 'textfield', expected: 1, selector: '.ct-field__title', description: 'visible title with textfield' },
    { title: 'Test Title', titleDisplay: 'visually_hidden', type: 'textfield', expected: 1, selector: '.ct-field__title.ct-visually-hidden', description: 'visually hidden title with textfield' },
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
        name: 'testname',
      });

      expect(c.querySelectorAll(selector)).toHaveLength(expected);
    });
  });
});
