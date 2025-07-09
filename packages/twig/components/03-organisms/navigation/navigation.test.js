const template = 'components/03-organisms/navigation/navigation.twig';

describe('Navigation Component', () => {
  test('renders with only required attributes', async () => {
    const c = await dom(template, {
      items: [
        { title: 'Home', url: '/' },
      ],
    });

    expect(c.querySelectorAll('.ct-navigation')).toHaveLength(1);

    const menuItems = c.querySelectorAll('.ct-navigation__menu .ct-link');
    expect(menuItems).toHaveLength(1);
    expect(menuItems[0].textContent.trim()).toBe('Home');

    assertUniqueCssClasses(c);
  });

  test('renders with all attributes provided', async () => {
    const c = await dom(template, {
      theme: 'dark',
      items: [
        { title: 'Home', url: '/', below: null },
        { title: 'About', url: '/about', below: null },
        { title: 'Services', url: '/services', below: null },
        { title: 'Contact', url: '/contact', below: null },
      ],
      title: 'Main Navigation',
      type: 'dropdown',
      variant: 'primary',
      dropdown_columns: 3,
      dropdown_columns_fill: true,
      is_animated: true,
      menu_id: 'main-nav',
      modifier_class: 'additional-class',
    });

    expect(c.querySelectorAll('.ct-navigation')).toHaveLength(1);
    expect(c.querySelector('.ct-navigation').classList).toContain('ct-theme-dark');
    expect(c.querySelector('.ct-navigation').classList).toContain('ct-navigation--dropdown');
    expect(c.querySelector('.ct-navigation').classList).toContain('additional-class');

    const menuItems = c.querySelectorAll('.ct-navigation__menu .ct-link');
    expect(menuItems).toHaveLength(4);
    expect(menuItems[0].textContent.trim()).toBe('Home');
    expect(menuItems[1].textContent.trim()).toBe('About');
    expect(menuItems[2].textContent.trim()).toBe('Services');
    expect(menuItems[3].textContent.trim()).toBe('Contact');

    expect(c.querySelector('.ct-navigation__title').textContent.trim()).toBe('Main Navigation');

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
      type: 'none',
      variant: 'secondary',
      modifier_class: '',
    });

    expect(c.querySelectorAll('.ct-navigation')).toHaveLength(1);
    expect(c.querySelector('.ct-navigation').classList).toContain('ct-theme-light');
    expect(c.querySelector('.ct-navigation').classList).toContain('ct-navigation--none');

    const menuItems = c.querySelectorAll('.ct-navigation__menu .ct-link');
    expect(menuItems).toHaveLength(2);
    expect(menuItems[0].textContent.trim()).toBe('Home');
    expect(menuItems[1].textContent.trim()).toBe('About');

    expect(c.querySelector('.ct-navigation__title')).toBeNull();

    assertUniqueCssClasses(c);
  });

  test('renders correctly when items have submenus', async () => {
    const c = await dom(template, {
      theme: 'dark',
      items: [
        { title: 'Services', url: '/services', below: [{ title: 'Consulting', url: '/services/consulting' }] },
        { title: 'Contact', url: '/contact', below: [{ title: 'Support', url: '/contact/support' }] },
      ],
      type: 'drawer',
      variant: 'primary',
      dropdown_columns: 2,
      dropdown_columns_fill: false,
      is_animated: true,
      menu_id: 'main-nav',
      modifier_class: '',
    });

    expect(c.querySelectorAll('.ct-navigation')).toHaveLength(1);
    expect(c.querySelector('.ct-navigation').classList).toContain('ct-theme-dark');
    expect(c.querySelector('.ct-navigation').classList).toContain('ct-navigation--drawer');

    const menuItems = c.querySelectorAll('.ct-navigation .ct-menu__item');
    expect(menuItems).toHaveLength(4);
    expect(menuItems[0].querySelector('.ct-link').textContent.trim()).toBe('Services');
    expect(menuItems[1].querySelector('.ct-link').textContent.trim()).toBe('Consulting');
    expect(menuItems[0].querySelector('.ct-menu__sub-menu .ct-link').textContent.trim()).toBe('Consulting');
    expect(menuItems[2].querySelector('.ct-link').textContent.trim()).toBe('Contact');
    expect(menuItems[3].querySelector('.ct-link').textContent.trim()).toBe('Support');
    expect(menuItems[2].querySelector('.ct-menu__sub-menu .ct-link').textContent.trim()).toBe('Support');

    assertUniqueCssClasses(c);
  });

  test('does not render when items are empty', async () => {
    const c = await dom(template, {
      items: [],
    });

    expect(c.querySelectorAll('.ct-navigation')).toHaveLength(0);
  });
});
