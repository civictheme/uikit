const template = 'components/02-molecules/social-links/social-links.twig';

describe('Social Links Component', () => {
  test('renders with required attributes', async () => {
    const c = await dom(template, {
      items: [
        { title: 'Facebook', icon: 'facebook', url: 'https://facebook.com' },
        { title: 'Twitter', icon: 'twitter', url: 'https://twitter.com' },
      ],
    });

    expect(c.querySelectorAll('.ct-social-links')).toHaveLength(1);

    const buttons = c.querySelectorAll('.ct-social-links__button');
    expect(buttons).toHaveLength(2);

    expect(buttons[0].getAttribute('href')).toEqual('https://facebook.com');
    expect(buttons[0].querySelector('svg')).not.toBeNull();

    expect(buttons[1].getAttribute('href')).toEqual('https://twitter.com');
    expect(buttons[1].querySelector('svg')).not.toBeNull();

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      items: [
        { title: 'Facebook', icon: 'facebook', url: 'https://facebook.com', icon_html: '<svg></svg>' },
        { title: 'Twitter', icon: 'twitter', url: 'https://twitter.com', icon_html: '<svg></svg>' },
      ],
      with_border: true,
      theme: 'dark',
      attributes: 'data-test="true"',
      modifier_class: 'custom-class',
    });

    const element = c.querySelector('.ct-social-links');
    expect(element).not.toBeNull();
    expect(element.classList.contains('ct-theme-dark')).toBe(true);
    expect(element.classList.contains('ct-social-links--with-border')).toBe(true);
    expect(element.classList.contains('custom-class')).toBe(true);
    expect(element.getAttribute('data-test')).toEqual('true');

    const buttons = c.querySelectorAll('.ct-social-links__button');
    expect(buttons).toHaveLength(2);

    expect(buttons[0].getAttribute('href')).toEqual('https://facebook.com');

    expect(buttons[1].getAttribute('href')).toEqual('https://twitter.com');

    assertUniqueCssClasses(c);
  });

  test('does not render when items are empty', async () => {
    const c = await dom(template, {
      items: [],
    });

    expect(c.querySelectorAll('.ct-social-links')).toHaveLength(0);
  });

  test('renders with icon HTML', async () => {
    const c = await dom(template, {
      items: [
        { title: 'Facebook', icon_html: '<svg></svg>', url: 'https://facebook.com' },
        { title: 'Twitter', icon_html: '<svg></svg>', url: 'https://twitter.com' },
      ],
    });

    const buttons = c.querySelectorAll('.ct-social-links__button');
    expect(buttons).toHaveLength(2);

    expect(buttons[0].getAttribute('href')).toEqual('https://facebook.com');

    expect(buttons[1].getAttribute('href')).toEqual('https://twitter.com');

    assertUniqueCssClasses(c);
  });
});
