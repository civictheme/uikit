import DrupalAttribute from 'drupal-attribute';

const template = 'components/03-organisms/side-navigation/side-navigation.twig';

describe('Side Navigation Component', () => {
  test('renders with only required attributes', async () => {
    const c = await dom(template, {
      items: [
        { title: 'Home', url: '/' },
      ],
    });

    expect(c.querySelectorAll('.ct-side-navigation')).toHaveLength(1);

    const menuItems = c.querySelectorAll('.ct-side-navigation__menu .ct-link');
    expect(menuItems).toHaveLength(1);
    expect(menuItems[0].textContent.trim()).toBe('Home');

    assertUniqueCssClasses(c);
  });

  test('renders with all attributes provided', async () => {
    const c = await dom(template, {
      theme: 'dark',
      items: [
        { title: 'Home', url: '/' },
        { title: 'About', url: '/about' },
        { title: 'Services', url: '/services' },
        { title: 'Contact', url: '/contact' },
      ],
      title: 'Main Navigation',
      vertical_spacing: 'both',
      attributes: new DrupalAttribute().setAttribute('data-test', 'true'),
      modifier_class: 'additional-class',
    });

    expect(c.querySelectorAll('.ct-side-navigation')).toHaveLength(1);
    expect(c.querySelector('.ct-side-navigation').classList).toContain('ct-theme-dark');
    expect(c.querySelector('.ct-side-navigation').classList).toContain('ct-vertical-spacing-inset--both');
    expect(c.querySelector('.ct-side-navigation').classList).toContain('additional-class');

    const menuItems = c.querySelectorAll('.ct-side-navigation__menu .ct-link');
    expect(menuItems).toHaveLength(4);
    expect(menuItems[0].textContent.trim()).toBe('Home');
    expect(menuItems[1].textContent.trim()).toBe('About');
    expect(menuItems[2].textContent.trim()).toBe('Services');
    expect(menuItems[3].textContent.trim()).toBe('Contact');

    expect(c.querySelector('.ct-side-navigation__title').textContent.trim()).toBe('Main Navigation');
    expect(c.querySelector('.ct-side-navigation').getAttribute('data-test')).toBe('true');

    assertUniqueCssClasses(c);
  });

  test('renders with some attributes missing', async () => {
    const c = await dom(template, {
      theme: 'light',
      items: [
        { title: 'Home', url: '/' },
        { title: 'About', url: '/about' },
      ],
      title: '',
      vertical_spacing: '',
      modifier_class: '',
    });

    expect(c.querySelectorAll('.ct-side-navigation')).toHaveLength(1);
    expect(c.querySelector('.ct-side-navigation').classList).toContain('ct-theme-light');

    const menuItems = c.querySelectorAll('.ct-side-navigation__menu .ct-link');
    expect(menuItems).toHaveLength(2);
    expect(menuItems[0].textContent.trim()).toBe('Home');
    expect(menuItems[1].textContent.trim()).toBe('About');

    expect(c.querySelector('.ct-side-navigation__title')).toBeNull();

    assertUniqueCssClasses(c);
  });

  test('does not render when items are empty', async () => {
    const c = await dom(template, {
      items: [],
    });

    expect(c.querySelectorAll('.ct-side-navigation')).toHaveLength(0);
  });
});
