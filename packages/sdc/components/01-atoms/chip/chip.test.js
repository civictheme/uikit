const template = 'components/01-atoms/chip/chip.twig';

describe('Chip Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      content: 'Sample Chip',
      kind: 'default',
      size: 'regular',
    });

    expect(c.querySelectorAll('.ct-chip')).toHaveLength(1);
    expect(c.querySelector('.ct-chip').textContent.trim()).toEqual('Sample Chip');
    expect(c.querySelector('.ct-chip').classList).toContain('ct-chip--default');
    expect(c.querySelector('.ct-chip').classList).toContain('ct-chip--regular');

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      content: 'Sample Chip',
      kind: 'input',
      size: 'large',
      is_selected: true,
      is_disabled: true,
      is_dismissible: true,
      is_multiple: true,
      group_parent: 'test-group',
      attributes: 'data-test="true"',
      modifier_class: 'custom-class',
      theme: 'dark',
    });

    expect(c.querySelectorAll('.ct-chip.custom-class.ct-theme-dark.ct-chip--input.ct-chip--large.active.ct-chip--multiple')).toHaveLength(1);
    expect(c.querySelector('.ct-chip').textContent.trim()).toContain('Sample Chip');
    expect(c.querySelector('.ct-chip').getAttribute('data-chip-group-parent')).toEqual('test-group');
    expect(c.querySelector('.ct-chip__input').getAttribute('data-test')).toEqual('true');
    expect(c.querySelector('.ct-chip__input').getAttribute('type')).toEqual('checkbox');
    expect(c.querySelector('.ct-chip__input').checked).toBe(true);

    assertUniqueCssClasses(c);
  });

  test('does not render when content is empty', async () => {
    const c = await dom(template, {
      content: '',
    });

    expect(c.querySelectorAll('.ct-chip')).toHaveLength(0);
  });
});
