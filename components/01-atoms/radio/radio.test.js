const template = 'components/01-atoms/radio/radio.twig';

describe('Radio Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      name: 'test-radio',
      id: 'radio-id',
      value: 'radio-value',
    });

    expect(c.querySelectorAll('.ct-radio')).toHaveLength(1);
    expect(c.querySelector('.ct-radio').getAttribute('name')).toEqual('test-radio');
    expect(c.querySelector('.ct-radio').getAttribute('id')).toEqual('radio-id');
    expect(c.querySelector('.ct-radio').getAttribute('value')).toEqual('radio-value');

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      name: 'test-radio',
      id: 'radio-id',
      value: 'radio-value',
      label: 'Radio Label',
      theme: 'dark',
      is_checked: true,
      is_invalid: true,
      is_disabled: true,
      attributes: 'data-test="true"',
      modifier_class: 'custom-class',
    });

    expect(c.querySelectorAll('.ct-radio.custom-class.ct-theme-dark.ct-radio--is-invalid')).toHaveLength(1);
    expect(c.querySelector('.ct-radio').getAttribute('name')).toEqual('test-radio');
    expect(c.querySelector('.ct-radio').getAttribute('id')).toEqual('radio-id');
    expect(c.querySelector('.ct-radio').getAttribute('value')).toEqual('radio-value');
    expect(c.querySelector('.ct-radio').hasAttribute('checked')).toBe(true);
    expect(c.querySelector('.ct-radio').hasAttribute('disabled')).toBe(true);
    expect(c.querySelector('.ct-radio').getAttribute('data-test')).toEqual('true');
    expect(c.querySelectorAll('label.ct-radio__label')).toHaveLength(1);
    expect(c.querySelector('label.ct-radio__label').textContent.trim()).toEqual('Radio Label');

    assertUniqueCssClasses(c);
  });

  test('does not render when name or id is empty', async () => {
    let c = await dom(template, {
      name: '',
      id: 'radio-id',
    });
    expect(c.querySelectorAll('.ct-radio')).toHaveLength(0);

    c = await dom(template, {
      name: 'test-radio',
      id: '',
    });
    expect(c.querySelectorAll('.ct-radio')).toHaveLength(0);
  });

  test('strips HTML tags from attribute values', async () => {
    const c = await dom(template, {
      name: 'test-radio',
      id: 'radio-id',
      value: 'radio-value',
      attributes: 'data-test="<script>alert(1)</script>"',
    });

    expect(c.querySelector('.ct-radio').getAttribute('data-test')).toEqual('<script>alert(1)</script>');

    assertUniqueCssClasses(c);
  });
});
