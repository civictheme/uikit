const template = 'components/00-base/icon/icon.twig';

describe('Icon Component', () => {
  test('renders with default values', async () => {
    const c = await dom(template, {
      symbol: 'close',
    });

    expect(c.querySelectorAll('.ct-icon')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-icon[aria-hidden="true"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-icon[role="img"]')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('renders with custom size', async () => {
    const c = await dom(template, {
      symbol: 'close',
      size: 'large',
      alt: 'Test Icon',
    });

    expect(c.querySelectorAll('.ct-icon.ct-icon--size-large')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-icon[aria-hidden="true"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-icon[role="img"]')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-icon[alt="Test Icon"]')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('renders with additional attributes and classes', async () => {
    const c = await dom(template, {
      symbol: 'close',
      modifier_class: 'custom-modifier',
      attributes: 'data-test="true"',
    });

    expect(c.querySelectorAll('.ct-icon.custom-modifier')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-icon[data-test="true"]')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('does not render when symbol is empty', async () => {
    const c = await dom(template, {
      symbol: '',
    });

    expect(c.querySelectorAll('.ct-icon')).toHaveLength(0);

    assertUniqueCssClasses(c);
  });
});
