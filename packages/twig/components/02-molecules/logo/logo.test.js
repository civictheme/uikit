import DrupalAttribute from 'drupal-attribute';

const template = 'components/02-molecules/logo/logo.twig';

describe('Logo Component', () => {
  test('renders primary logo only for default type', async () => {
    const c = await dom(template, {
      theme: 'light',
      type: 'default',
      logos: {
        primary: {
          mobile: { url: 'https://example.com/logo-mobile.png', alt: 'Logo Mobile' },
          desktop: { url: 'https://example.com/logo-desktop.png', alt: 'Logo Desktop' },
        },
      },
    });

    expect(c.querySelectorAll('.ct-logo')).toHaveLength(1);
    const logoImages = c.querySelectorAll('.ct-logo__image');
    expect(logoImages).toHaveLength(2);
    expect(logoImages[0].getAttribute('src')).toEqual('https://example.com/logo-mobile.png');
    expect(logoImages[1].getAttribute('src')).toEqual('https://example.com/logo-desktop.png');

    assertUniqueCssClasses(c);
  });

  test('renders with optional attributes', async () => {
    const c = await dom(template, {
      theme: 'dark',
      type: 'stacked',
      logos: {
        primary: {
          mobile: { url: 'https://example.com/logo-mobile.png', alt: 'Logo Mobile' },
          desktop: { url: 'https://example.com/logo-desktop.png', alt: 'Logo Desktop' },
        },
        secondary: {
          mobile: { url: 'https://example.com/secondary-logo-mobile.png', alt: 'Secondary Logo Mobile' },
          desktop: { url: 'https://example.com/secondary-logo-desktop.png', alt: 'Secondary Logo Desktop' },
        },
      },
      url: 'https://example.com',
      title: 'Go to homepage',
      attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
      modifier_class: 'custom-class',
    });

    const element = c.querySelector('.ct-logo');
    expect(element).not.toBeNull();
    expect(element.classList.contains('ct-theme-dark')).toBe(true);
    expect(element.classList.contains('ct-logo--stacked')).toBe(true);
    expect(element.classList.contains('custom-class')).toBe(true);
    expect(element.getAttribute('data-test')).toEqual('true');
    expect(element.getAttribute('href')).toEqual('https://example.com');
    expect(element.getAttribute('title')).toEqual('Go to homepage');

    const logoImages = c.querySelectorAll('.ct-logo__image');
    expect(logoImages).toHaveLength(4);
    expect(logoImages[0].getAttribute('src')).toEqual('https://example.com/logo-mobile.png');
    expect(logoImages[1].getAttribute('src')).toEqual('https://example.com/logo-desktop.png');
    expect(logoImages[2].getAttribute('src')).toEqual('https://example.com/secondary-logo-mobile.png');
    expect(logoImages[3].getAttribute('src')).toEqual('https://example.com/secondary-logo-desktop.png');

    assertUniqueCssClasses(c);
  });

  test('does not render when logos are empty', async () => {
    const c = await dom(template, {
      logos: {},
    });

    expect(c.querySelectorAll('.ct-logo')).toHaveLength(0);
  });

  test('renders as div when URL is not provided', async () => {
    const c = await dom(template, {
      theme: 'light',
      type: 'default',
      logos: {
        primary: {
          mobile: { url: 'https://example.com/logo-mobile.png', alt: 'Logo Mobile' },
          desktop: { url: 'https://example.com/logo-desktop.png', alt: 'Logo Desktop' },
        },
      },
    });

    const element = c.querySelector('.ct-logo');
    expect(element).not.toBeNull();
    expect(element.tagName).toEqual('DIV');
  });

  test('renders as link when URL is provided', async () => {
    const c = await dom(template, {
      theme: 'light',
      type: 'default',
      logos: {
        primary: {
          mobile: { url: 'https://example.com/logo-mobile.png', alt: 'Logo Mobile' },
          desktop: { url: 'https://example.com/logo-desktop.png', alt: 'Logo Desktop' },
        },
      },
      url: 'https://example.com',
      title: 'Go to homepage',
    });

    const element = c.querySelector('.ct-logo');
    expect(element).not.toBeNull();
    expect(element.tagName).toEqual('A');
    expect(element.getAttribute('href')).toEqual('https://example.com');
    expect(element.getAttribute('title')).toEqual('Go to homepage');
  });
});
