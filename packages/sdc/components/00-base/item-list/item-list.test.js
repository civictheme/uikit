const template = 'components/00-base/item-list/item-list.twig';

describe('Link List Component', () => {
  test('renders with default values', async () => {
    const c = await dom(template, {
      items: [
        '<a href="/">Home</a>',
        '<a href="/about">About</a>',
        '<a href="/contact">Contact</a>',
      ],
    });

    expect(c.querySelectorAll('.ct-item-list')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-item-list__item')).toHaveLength(3);
    expect(c.querySelector('.ct-item-list__item').textContent.trim()).toEqual('Home');
    expect(c.querySelector('.ct-item-list__item:nth-child(2)').textContent.trim()).toEqual('About');
    expect(c.querySelector('.ct-item-list__item:nth-child(3)').textContent.trim()).toEqual('Contact');

    assertUniqueCssClasses(c);
  });

  test('renders with vertical direction', async () => {
    const c = await dom(template, {
      direction: 'vertical',
      items: [
        '<a href="/">Home</a>',
        '<a href="/about">About</a>',
        '<a href="/contact">Contact</a>',
      ],
    });

    expect(c.querySelectorAll('.ct-item-list.ct-item-list--vertical')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-item-list__item')).toHaveLength(3);

    assertUniqueCssClasses(c);
  });

  test('renders with large size', async () => {
    const c = await dom(template, {
      size: 'large',
      items: [
        '<a href="/">Home</a>',
        '<a href="/about">About</a>',
        '<a href="/contact">Contact</a>',
      ],
    });

    expect(c.querySelectorAll('.ct-item-list.ct-item-list--large')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-item-list__item')).toHaveLength(3);

    assertUniqueCssClasses(c);
  });

  test('renders without gaps', async () => {
    const c = await dom(template, {
      no_gap: true,
      items: [
        '<a href="/">Home</a>',
        '<a href="/about">About</a>',
        '<a href="/contact">Contact</a>',
      ],
    });

    expect(c.querySelectorAll('.ct-item-list.ct-item-list--no-gap')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-item-list__item')).toHaveLength(3);

    assertUniqueCssClasses(c);
  });

  test('renders with custom attributes and classes', async () => {
    const c = await dom(template, {
      items: [
        '<a href="/">Home</a>',
        '<a href="/about">About</a>',
        '<a href="/contact">Contact</a>',
      ],
      attributes: 'data-test="true"',
      modifier_class: 'custom-modifier',
    });

    expect(c.querySelectorAll('.ct-item-list.custom-modifier')).toHaveLength(1);
    expect(c.querySelectorAll('.ct-item-list[data-test="true"]')).toHaveLength(1);

    assertUniqueCssClasses(c);
  });

  test('does not render when items are empty', async () => {
    const c = await dom(template, {
      items: [],
    });

    expect(c.querySelectorAll('.ct-item-list')).toHaveLength(0);
  });
});
